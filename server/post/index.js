const postdb = require("../models/Post.js");
const cloudinary = require("cloudinary").v2;
const stream = require("stream");
const User = require("../models/User.js");

const Post = async (req, res) => {
  const { userId } = req.params;
  const { post, fullName, interest, profilePic } = req.body;
  const file = req.file;

  if (!post?.trim() || !userId) {
    return res.status(400).json({ message: "Post or userId missing" });
  }
    const userfound = await User.findById(userId);
    if(!userfound){
      return res.status(404).json("user not found");
    }
    console.log("hey");
  try {
    let imageUrl = "";
    if (file) {
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "postFolder" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );

        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream);
      });
    }

    const postSave = await postdb.create({
      fullName,
      interest,
      profilePic,
      post,
      userId,
      postPic: imageUrl,
    });

    return res.status(200).json({
      message: "Post created successfully",
      post: postSave,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = Post;