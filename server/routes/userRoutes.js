import express from 'express';
import { registerUser, loginUser, getAllUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// User login
router.post('/login', loginUser); 

// Get all users
router.get('/', getAllUsers);

// Get a user by ID
router.get('/:id', getUserById);

export default router;