import express from "express";
import { handleConvoAIQuery } from "../controllers/chatController.js";

const router = express.Router();

// Create new chat
// router.post("/create-chat", createChat);

// create gemini chat
router.post("/chat", handleConvoAIQuery);

export default router;
