import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { uploadFileToS3 } from "./uploads/s3Upload.js";
import SharedItem from './models/SharedItem.js'; 
// Initialize app and load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;
const upload = multer({ dest: "uploads/" }); 

// Middlewares
app.use(
  cors({
    origin: [process.env.ORIGIN || '*'],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Database connection
mongoose
  .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection error:", err.message));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/ai", chatRoutes);

app.get("/", (req, res) => {
  return res.json({ status: "Convo backend server" });
});

// File upload endpoint for S3
// app.post("/upload", upload.single("file"), async (req, res) => {
//   const file = req.file;
//   const channelId = req.body.channelId;

//   if (!file || !channelId) {
//     console.error("Missing file or channelId");
//     return res.status(400).json({ error: "File or channelId missing" });
//   }

//   try {
//     const s3Url = await uploadFileToS3(file, channelId);
//     fs.unlinkSync(file.path); 
//     res.json({ url: s3Url }); 
//   } catch (error) {
//     console.error("File upload error:", error); 
//     res.status(500).json({ error: "Server error during file upload" });
//   }
// });
app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const channelId = req.body.channelId;

  if (!file || !channelId) {
    console.error("Missing file or channelId");
    return res.status(400).json({ error: "File or channelId missing" });
  }

  try {
    // Upload file to S3
    const s3Url = await uploadFileToS3(file, channelId);

    // Save metadata to database
    const newItem = new SharedItem({
      channelId,
      type: file.mimetype.startsWith('image') ? 'image' : 'file',
      assetUrl: s3Url,
      imageUrl: s3Url,
      title: file.originalname,
    });
    await newItem.save();

    // Delete the local file after uploading
    fs.unlinkSync(file.path);

    res.json({ url: s3Url });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "Server error during file upload" });
  }
});
app.get("/shared-items", async (req, res) => {
  const { channelId } = req.query;

  try {
    const items = await SharedItem.find({ channelId });
    res.json({ items });
  } catch (error) {
    console.error("Error retrieving shared items:", error);
    res.status(500).json({ error: "Failed to fetch shared items" });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});