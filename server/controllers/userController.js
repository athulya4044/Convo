import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Register a new user
export const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = new User({ 
        name, 
        email, 
        password_hash: hashedPassword 
      });
  
      await newUser.save();
      
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// User login
export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
