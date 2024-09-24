import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

// middlewares
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.listen(PORT, (req, res) => {
  console.log(`Server running on http://localhost:${PORT}`);
});

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err.message));

// routes
app.get("/", (req, res) => {
  return res.json({ status: "Convo backend server" });
});
