const postdb = require("../models/Post");


const UserPost=async(req,res)=>{
  const { userId }=req.params;
  
  const findUserPost = await postdb.find({ userId  : userId}).sort({_id : -1});
  return res.status(200).json({
    message:"Users post are returned",
    Userpost: findUserPost
  })
}
module.exports=UserPost;