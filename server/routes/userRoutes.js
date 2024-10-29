import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getUserByEmailAndSendEmail,
  resetUserPassword,
  searchUsersAndGroups
} from "../controllers/userController.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Search route for users and groups
router.get("/search", searchUsersAndGroups);

// Get a user by ID
router.get("/:id", getUserById);

// Get a user by email
router.get("/forgot-password/:email", getUserByEmailAndSendEmail);

// Reset user password
router.post("/reset-password", resetUserPassword);

// Get all users
router.get("/", getAllUsers);



export default router;
