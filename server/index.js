import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";

import userRoutes from "./routes/userRoutes.js";
import { uploadFileToS3 } from "./uploads/s3Upload.js";

// Initialize app and load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;
const upload = multer({ dest: "uploads/" }); 

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


// File upload endpoint for S3
app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const channelId = req.body.channelId;

  if (!file || !channelId) {
    console.error("Missing file or channelId");
    return res.status(400).json({ error: "File or channelId missing" });
  }

  try {
    const s3Url = await uploadFileToS3(file, channelId); // Upload to S3
    console.log("S3 URL returned:", s3Url); // Log the S3 URL

    fs.unlinkSync(file.path); // Clean up local file after upload
    res.json({ url: s3Url }); // Send the S3 URL in the response
  } catch (error) {
    console.error("File upload error:", error); // Log any errors
    res.status(500).json({ error: "Server error during file upload" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});