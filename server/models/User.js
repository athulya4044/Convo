import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    default: null, 
  },
  status: {
    type: String,
    enum: ["online", "offline", "away"],
    default: "offline",
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
