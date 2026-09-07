const postdb = require("../models/Post");
const mongoose = require("mongoose");
const connectToMongoDb = require("../db/connection");
const redisClient = require("../post/redis");

const UserPost = async (req, res) => {
  const { userId } = req.params;
  const requestedLimit = parseInt(req.query.limit, 10);

  const page = parseInt(req.query.page);

  const cachekey = `post:${page}${requestedLimit}`;

  const cachedata = await redisClient.get(cachekey);
  if (cachedata) {
    return res.json({
      source: "redis",
      Userpost: JSON.parse(cachedata),
    });
  }
  const limit =
    Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 10)
      : 10;
  try {
    const findUserPost = await postdb
      .find({ userId: userId })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    await redisClient.set(cachekey, JSON.stringify(findUserPost), {
      EX: 60,
    });

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
