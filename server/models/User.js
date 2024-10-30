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
  phone_number: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"], // E.164 format
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
