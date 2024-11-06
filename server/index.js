import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";

import userRoutes from "./routes/userRoutes.js";
import { uploadFileToS3 } from "./s3Upload.js"; // Import the S3 upload function

// Initialize app and load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

// Middlewares
app.use(
  cors({
    origin: [process.env.ORIGIN],
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

app.get("/", (req, res) => {
  return res.json({ status: "Convo backend server" });
});

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" }); // Temporary folder for file uploads

// File upload endpoint for S3
app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const s3Url = await uploadFileToS3(file); // Call S3 upload function
    fs.unlinkSync(file.path); // Remove file from local storage after uploading to S3
    if (s3Url) {
      res.json({ url: s3Url }); // Return S3 URL as response
    } else {
      res.status(500).json({ error: "Failed to upload file to S3" });
    }
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "Server error during file upload" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});