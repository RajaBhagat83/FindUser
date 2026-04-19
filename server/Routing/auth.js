const express = require("express")
const Post = require("../post/index.js");
const router =express.Router();
const multer = require("multer");

console.log("1");
const upload = multer({
  storage : multer.memoryStorage(),
  limits : { fileSize: 10 * 1024 * 1024 }
})
console.log("2")

router.post("/upload-post/:userId",upload.single("image"),Post);

module.exports= router;