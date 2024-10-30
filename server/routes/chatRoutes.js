import express from "express";
import { createChat } from "../controllers/chatController.js";

const router = express.Router();

// Create new chat
router.post("/create-chat", createChat);

export default router;

