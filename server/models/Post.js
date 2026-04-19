const mongoose = require("mongoose")

const PostSchema = mongoose.Schema({
  fullName:{
    type:String,
    required:true
  },
  interest :{
    type:String,
    required:true
  },
  profilePic : {
    type:String,
    default:""
  },
  post : {
    type:String,
    required:true
 },
 postPic:{
  type:String,
  default:""
 },
 userId :{
  type:mongoose.Schema.Types.ObjectId,
  ref : "User"
 }
},
{timestammps : true}
)
const postdb =  mongoose.model('postdb',PostSchema);
module.exports = postdb;