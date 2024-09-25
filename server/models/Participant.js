import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  chat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Participant = mongoose.model("Participant", participantSchema);
export default Participant;
