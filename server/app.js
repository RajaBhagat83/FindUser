require("dotenv").config(); //used to load .env variable to process.env
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const multer = require("multer");
const auth = require("./Routing/auth.js");
const connectToMongoDb = require("./db/connection.js");
const cloudinary = require("cloudinary").v2;
const User = require("./models/User");
const Conversation = require("./models/Conversation");
const Messages = require("./models/Messages");
const postdb = require("./models/Post.js");
const redisClient = require("./post/redis.js");
JWT_SECRET = "secret";

require("./db/connection.js");

const app = express();
const server = http.createServer(app);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
});

// console.log("keu is ", process.env.CLOUDINARY_API_KEY);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    Credential: true,
  },
});

app.use(async (req, res, next) => {
  try {
    await connectToMongoDb();
    next();
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" })); //url-encoded form data ko parse karta hai

app.use("/uploads", express.static("uploads"));
app.use("/Chat", auth);
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use("/user/upload", auth);

let users = []; //stores online users [{userId, socketId}]

function broadcastOnlineUsers() {
  // Send unique user IDs (no duplicates)
  const onlineUserIds = [...new Set(users.map((u) => u.userId))];
  io.emit("updateUserStatus", onlineUserIds); // broadcast to all clients
}

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("addUser", (userId) => {
    // Allow multiple sockets per user
    users.push({ userId, socketId: socket.id });
    io.emit("getUsers", users);
    broadcastOnlineUsers();
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, conversationId }) => {
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const user = await User.findById(senderId);
      const payload = {
        senderId,
        message,
        conversationId,
        receiverId,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          interest: user.interest,
        },
      };
      if (receiver) {
        io.to(receiver.socketId).emit("getMessage", payload);
      }
      if (sender) {
        io.to(sender.socketId).emit("getMessage", payload);
      }
    },
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

function removeUser(socketId) {
  users = users.filter((user) => user.socketId !== socketId);
  broadcastOnlineUsers(); // update online users after removal
}

app.get("/", (req, res) => res.send("Welcome"));

// Auth Endpoints
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password, interest } = req.body;

    if (!fullName || !email || !password || !interest) {
      return res
        .status(400)
        .json({ message: "Please enter all required details." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      interest,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        interest: newUser.interest,
        profilePic: newUser.profilePic,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("Invalid input");

  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send("Incorrect password");

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || "Secret",
    { expiresIn: "24h" },
  );

  await User.updateOne({ _id: user._id }, { $set: { token } });

  res.status(200).json({
    message: "Login successful",
    user: {
      fullName: user.fullName,
      email: user.email,
      interest: user.interest,
      _id: user._id,
      profilePic: user.profilePic,
    },
    token,
  });
});

// ===== Conversation Endpoints =====
app.post("/api/conversation", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId)
      return res.status(400).send("Required IDs missing");

    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).send("Invalid senderId or receiverId format");
    }

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = new Conversation({ members: [senderId, receiverId] });
      await conversation.save();
    }

    res.status(200).json({ conversationId: conversation._id });
  } catch (error) {
    console.error("Error in post /api/conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/conversation/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cacheData = `connections : ${userId}`;
    const foundData = await redisClient.get(cacheData);

    if (foundData) {
      const connection = JSON.parse(foundData);
      return res.json({
        source: "redis",
        filteredResult: connection,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).send("Invalid userId");

    const conversations = await Conversation.find({ members: userId });
    const result = [];

    for (const conv of conversations) {
      const otherId = conv.members.find((id) => id.toString() !== userId);
      if (!otherId) continue;

      const user = await User.findById(otherId);
      if (!user) continue;

      const isOnline = users.some((u) => u.userId === otherId.toString());

      result.push({
        user: {
          receiverId: user._id,
          fullName: user.fullName,
          email: user.email,
          interest: user.interest,
          isOnline,
          profilePic: user.profilePic,
        },
        conversationId: conv._id,
      });
    }

    const filteredResult = result.filter((r) => r !== null);
    await redisClient.set(cacheData, JSON.stringify(filteredResult), {
      Ex: 60,
    });
    res.status(200).json({
      source: "main",
      filteredResult: filteredResult,
    });
  } catch (error) {
    console.error("Error in get /api/conversation/:userId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  Messages Endpoints
app.post("/api/messages", async (req, res) => {
  try {
    let { ConversationId, senderId, message, receiverId } = req.body;
    if (!senderId || !message)
      return res.status(400).send("Required fields missing");

    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).send("Invalid senderId format");
    }

    if (ConversationId === "new" && receiverId) {
      if (!mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).send("Invalid receiverId format");
      }
      let conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      });
      if (!conversation) {
        conversation = new Conversation({ members: [senderId, receiverId] });
        await conversation.save();
      }
      ConversationId = conversation._id;
    }

    const newMessage = new Messages({
      ConversationId,
      senderId,
      message,
    });
  
    await newMessage.save();
    await redisClient.del(`connections : ${senderId}`);
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      ConversationId,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error in post /api/messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/messages/:ConversationId", async (req, res) => {
  try {
    let { ConversationId } = req.params;

    if (ConversationId === "new") {
      const { senderId, receiverId } = req.query;
      if (!senderId || !receiverId) {
        return res.status(400).send("Required query parameters missing");
      }
      if (
        !mongoose.Types.ObjectId.isValid(senderId) ||
        !mongoose.Types.ObjectId.isValid(receiverId)
      ) {
        return res.status(400).send("Invalid senderId or receiverId format");
      }
      const conv = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      });
      if (!conv) return res.status(200).json([]);
      ConversationId = conv._id;
    } else {
      if (!mongoose.Types.ObjectId.isValid(ConversationId)) {
        return res.status(400).send("Invalid ConversationId format");
      }
    }

    const messages = await Messages.find({ ConversationId: ConversationId });
    const result = [];

    for (const msg of messages) {
      if (!mongoose.Types.ObjectId.isValid(msg.senderId)) continue;
      const sender = await User.findById(msg.senderId);

      if (!sender) continue;

      result.push({
        user: {
          _id: sender._id,
          email: sender.email,
          fullName: sender.fullName,
          interest: sender.interest,
          profilePic: sender.profilePic,
        },
        message: msg.message,
        createdAt: msg.createdAt,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in get /api/messages/:ConversationId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  Get Users Endpoints
app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }
    const usersData = await User.findOne({ _id: userId });

    res.status(200).json({
      user: usersData,
    });
  } catch (error) {
    console.error("Error in get /api/users/:userId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const usersData = await User.find();
    const result = usersData.map((user) => {
      const isOnline = users.some((u) => u.userId === user._id.toString());
      return {
        user: {
          email: user.email,
          fullName: user.fullName,
          receiverId: user._id,
          interest: user.interest || "",
          isOnline,
          profilePic: user.profilePic,
        },
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/user/post", async (req, res) => {
  try {
    const cursor = req.query.cursor;
    let query = {};
    if (cursor) {
      query._id = { $lt: cursor };
    }
    const requestedLimit = parseInt(req.query.limit, 10);
    const cacheData = `posts:${requestedLimit}:${cursor || "first"}`;
    const founddata = await redisClient.get(cacheData);

    if (founddata) {
      console.log("Cache found");
      const post = JSON.parse(founddata);
      const nextcursor = post.length > 0 ? post[post.length - 1] : null;
      return res.json({
        source: "redis",
        post: JSON.parse(founddata),
        nextcursor,
      });
    }
    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 10)
        : 10;

    const post = await postdb.find(query).sort({ _id: -1 }).limit(limit);

    await redisClient.set(cacheData, JSON.stringify(post), { Ex: 60 });

    const nextcursor = post.length > 0 ? post[post.length - 1] : null;
    return res.json({
      source: "main",
      post: post,
      nextcursor,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post(
  "/api/upload-profile",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const file = req.file;
      const userId = req.body;
      if (!userId || !req.file) {
        return res.status(400).json({ message: "Missing userId or file" });
      }
      const uploadStream = await cloudinary.uploader.upload_stream(
        { folder: "profile-picture" },
        async (error, result) => {
          if (error) {
            return res.status(500).send({ error: "upload error" });
          }

          await User.findByIdAndUpdate(
            userId.userId,
            { profilePic: result.secure_url },
            { new: true },
          );
          return res.status(200).json({
            message: "upload success",
            profilePic: result.secure_url,
          });
        },
      );
      const stream = require("stream");
      const buffeStream = new stream.PassThrough();
      buffeStream.end(file.buffer);
      buffeStream.pipe(uploadStream);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// const PORT = process.env.PORT || 8000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = app;
