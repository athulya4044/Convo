import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  message_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
  file_name: {
    type: String,
    required: true,
  },
  file_type: {
    type: String,
    required: true,
  },
  file_size: {
    type: Number, 
  },
  file_path: {
    type: String,
    required: true, 
  },
}, { timestamps: true });

const File = mongoose.model("File", fileSchema);
export default File;
