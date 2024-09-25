import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true, 
  },
  message_type: {
    type: String,
    enum: ["text", "image", "file", "emoji"],
    default: "text", 
  },
  file_url: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;

  