import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getUserByEmailAndSendEmail,
  resetUserPassword,
} from "../controllers/userController.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Get a user by ID
router.get("/:id", getUserById);

// Get a user by email
router.get("/forgot-password/:email", getUserByEmailAndSendEmail);

// Reset user password
router.post("/reset-password", resetUserPassword);

// Get all users
router.get("/", getAllUsers);

export default router;
