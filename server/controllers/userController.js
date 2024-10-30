import User from "../models/User.js";
import Chat from "../models/Chat.js";
import bcrypt from "bcrypt";
import twilio from "twilio";
import { sendPasswordResetEmail } from "../utilities/sendEmail.js";
import { StreamChat } from "stream-chat";
import stripSpecialCharacters from "../utilities/stripSpecialCharacters.js";

// Init twilio
const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Init stream chat
const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;
const streamServerClient = StreamChat.getInstance(
  streamApiKey,
  streamApiSecret
);

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(200).json({
        error:
          "User already exists. Please try with a different email / phone number",
      });
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
        name,
        email,
        password_hash: hashedPassword,
        phoneNumber,
      });

      await newUser.save();

      return res.status(201).json({
        message: "User registered successfully. Please Login to continue",
        user: newUser,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate stream token
    const userId = stripSpecialCharacters(email);
    const token = streamServerClient.createToken(userId);

    // Prepare user details for Stream Chat
    const userDetails = {
      id: userId,
      email: user.email,
      name: user.name,
      image_url: user.image_url,
      phoneNumber: user.phoneNumber,
    };

    // Upsert user details in Stream Chat
    await streamServerClient.upsertUser(userDetails);

    res
      .status(200)
      .json({ message: "Login successful", user, streamToken: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by email
export const getUserByEmailAndSendEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({
        error: "User not found with the associated email. Please try again",
      });
    await sendPasswordResetEmail({
      email: user.email,
      token: user._id,
      userName: user.name,
    });
    res.status(200).json({
      message:
        "We've sent you an email with instructions to reset your password.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset user password
export const resetUserPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.findByIdAndUpdate(token, {
      $set: {
        password_hash: hashedPassword,
      },
    });
    if (!user) {
      return res
        .status(200)
        .json({ error: "Invalid User. Check the URL and try again" });
    }
    console.log("passwords changed");
    return res.status(200).json({ message: "Password updated successfully !" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search for users and groups based on query
export const searchUsersAndGroups = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      name: { $regex: query, $options: "i" }
    });
    const groups = await Chat.find({
      chat_name: { $regex: query, $options: "i" }
    });
    
    res.status(200).json({
      users: users.length ? users : "No users found",
      groups: groups.length ? groups : "No groups found"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
