import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  is_group: {
    type: Boolean,
    required: true,
    default: false,  
  },
  chat_name: {
    type: String,
    trim: true,
    default: null,
  },
  is_private: {
    type: Boolean,
    default: true, 
  },
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
