const express = require("express")
const Post = require("../post/index.js");
const router =express.Router();
const multer = require("multer");
const UserPost = require("../post/UserPost.js");


const upload = multer({
  storage : multer.memoryStorage(),
  limits : { fileSize: 10 * 1024 * 1024 }
})

router.post("/upload-post/:userId",upload.single("image"),Post);
router.get('/getpost/:userId',UserPost)

module.exports= router;