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
const auth = require("./Routing/auth.js")

const cloudinary = require("cloudinary").v2;
const User = require("./models/User");
const Conversation = require("./models/Conversation");
const Messages = require("./models/Messages");
const postdb = require("./models/Post.js");
JWT_SECRET = "secret";

require("./db/connection.js");

const app = express();
const server = http.createServer(app);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
});

console.log("keu is ", process.env.CLOUDINARY_API_KEY);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors()); 
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: false, limit: '50mb' }));//url-encoded form data ko parse karta hai

app.use("/uploads", express.static("uploads")); 
const storage = multer.memoryStorage();
 const upload = multer({ storage });

app.use("/user/upload",auth);

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
      console.log("users in the send messages emit section", users);
      console.log("reciverId in the send message", receiverId);
      console.log("senderId in the send message", senderId);
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      console.log("sender", sender);
      console.log("receiver", receiver);
      const user = await User.findById(senderId);
      if (receiver && sender) {
        io.to(receiver.socketId)
          .to(sender.socketId)
          .emit("getMessage", {
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
          });
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
  const { senderId, receiverId } = req.body;
  if (!senderId || !receiverId)
    return res.status(400).send("Required IDs missing");

  let conversation = await Conversation.findOne({
    members: { $all: [senderId, receiverId] },
  });
  if (!conversation) {
    conversation = new Conversation({ members: [senderId, receiverId] });
    await conversation.save();
  }

  res.status(200).json({ conversationId: conversation._id });
});

app.get("/api/conversation/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).send("Invalid userId");

  const conversations = await Conversation.find({ members: userId });
  const result = [];

  for (const conv of conversations) {
    const otherId = conv.members.find((id) => id.toString() !== userId);

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

  res.status(200).json(filteredResult);
});

//  Messages Endpoints
app.post("/api/messages", async (req, res) => {
  let { ConversationId, senderId, message, receiverId } = req.body;
  if (!senderId || !message)
    return res.status(400).send("Required fields missing");

  if (ConversationId === "new" && receiverId) {
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

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    ConversationId,
    data: newMessage,
  });
});

app.get("/api/messages/:ConversationId", async (req, res) => {
  let { ConversationId } = req.params;

  if (ConversationId === "new") {
    const { senderId, receiverId } = req.query;
    const conv = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!conv) return res.status(200).json([]);
    ConversationId = conv._id;
  }

  const messages = await Messages.find({ ConversationId: ConversationId });
  const result = [];

  for (const msg of messages) {
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
});

//  Get Users Endpoints
app.get("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const usersData = await User.find({ _id: { $ne: userId } });

  const result = usersData.map((user) => {
    const isOnline = users.some((u) => u.userId === user._id.toString());
    return {
      user: {
        email: user.email,
        fullName: user.fullName,
        receiverId: user._id,
        interest: user.interest,
        isOnline,
        profilePic: user.profilePic,
      },
    };
  });

  res.status(200).json(result);
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

app.get("/user/post",async(req,res) =>{
  const post = await postdb.find();
  return res.json(post);
})

app.post(
  "/api/upload-profile",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const file = req.file;
      const userId = req.body;
      console.log("User id",userId);
      if (!userId || !req.file) {
        return res.status(400).json({ message: "Missing userId or file" });
      }
      console.log("file in backend", file);

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



// ===== Start Server =====
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//stores the name of the images into the mongo storage and fetches and used in the frontned
// app.post("/api/upload-profile",upload.single("profilePic"), async (req, res) => {
//     try {
//       const { userId } = req.body;
//       if (!userId || !req.file)
//         return res.status(400).json({ message: "Missing userId or file" });

//       const filePath = `/uploads/${req.file.filename}`;
//       const user = await User.findByIdAndUpdate(
//         userId,
//         { profilePic: filePath },
//         { new: true },
//       );
//       res.status(200).json({
//         message: "Profile picture updated successfully",
//         profilePic: user.profilePic,
//       });
//     } catch (err) {
//       console.error("Error uploading profile picture:", err);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
// );
