const postdb = require("../models/Post");
const mongoose = require("mongoose");
const connectToMongoDb = require("../db/connection");

const UserPost = async (req, res) => {
  const { userId } = req.params;
  const requestedLimit = parseInt(req.query.limit, 10);
  console.log("page", req.query.page);
  console.log("limit", req.query.limit);
  const page = parseInt(req.query.page);
  const limit =
    Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 10)
      : 10;
  try {
    // await connectToMongoDb();
    const findUserPost = await postdb
      .find({ userId: userId })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    console.log("User posts count:", findUserPost.length);
    return res.status(200).json({
      message: "Users posts are returned",
      Userpost: findUserPost,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = UserPost;
