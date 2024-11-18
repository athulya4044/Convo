import express from "express";
import { generateVideoToken } from "../controllers/videoController.js";

const router = express.Router();

router.post('/generate-token', generateVideoToken);

export default router;
