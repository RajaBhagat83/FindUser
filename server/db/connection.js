 const mongoose = require("mongoose");

//  const url =process.env.DATABASE_URL;
// mongoose.connect(url,{
//   useNewUrlParser:true,
//   useUnifiedTopology:true
// }).then(() => console.log("Connected to db")).catch((e)=>console.log("error",e));


const MONGO_URL =process.env.DATABASE_URL;
if (!MONGO_URL) throw new Error("MONGO_URL not defined");

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

 async function connectToMongoDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log("Connected to MongoDB Atlas");
  return cached.conn;
}
module.exports = connectToMongoDb;