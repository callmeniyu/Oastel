import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  image: String,
  password: String, // optional for Google auth
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
