import User from "../models/User.js";
import bcrypt from "bcrypt";
import twilio from "twilio";
import { sendPasswordResetEmail } from "../utilities/sendEmail.js";
import { StreamChat } from "stream-chat";
import stripSpecialCharacters from "../utilities/stripSpecialCharacters.js";
import Stripe from "stripe";

// init twilio
const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// init stream chat
const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;
const streamServerClient = StreamChat.getInstance(
  streamApiKey,
  streamApiSecret
);

// init stripe
const stripe = new Stripe(process.env.STRIPE_API_KEY);

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

    // generate stream token
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

// send forget password email
export const getUserByEmailAndSendEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({
        error: "User not found with the associated email. Please try again",
      });
    // trigger an email
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

// reset user password
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

// Send OTP for forget password
export const sendUserOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Check if phone number is registered
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(200).json({
        error:
          "User not found with the associated phone number. Please try again",
      });
    }

    // Send OTP via Twilio Verify Service
    await twilioClient.verify.v2
      .services(process.env.TWILIO_MSG_SERVICE_ID)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      })
      .then((verification) => {
        console.log(
          `OTP request sent to ${phoneNumber}. Status: ${verification.status}`
        );
      });

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error sending OTP. Please try again." });
  }
};

export const verifyUserOTP = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    const user = await User.findOne({ phoneNumber });

    // Verify the OTP using Twilio Verify Service
    const verificationCheck = await twilioClient.verify.v2
      .services(process.env.TWILIO_MSG_SERVICE_ID)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });

    if (verificationCheck.status === "approved") {
      console.log(
        `OTP request sent to ${phoneNumber}. Status: ${verificationCheck.status}`
      );
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully!",
        userID: user._id,
      });
    } else {
      return res
        .status(200)
        .json({ success: false, error: "Invalid or expired OTP." });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ error: "Error verifying OTP. Please try again." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, name, image_url, phoneNumber } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        error: "User not found. Please try again",
      });
    }

    await User.findByIdAndUpdate(user._id, {
      $set: {
        name,
        image_url,
        phoneNumber,
      },
    });

    // generate stream token
    const userId = stripSpecialCharacters(email);

    // Prepare updated user details for Stream Chat
    const userDetails = {
      id: userId,
      name,
      email,
      image_url,
      phoneNumber,
    };

    // Upsert user details in Stream Chat
    await streamServerClient.upsertUser(userDetails);

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ error: "Error updating user" });
  }
};

export const purchaseSubscription = async (req, res) => {
  const { paymentMethodId, email, plan } = req.body;

  try {
    // Create a customer
    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Select the appropriate price ID based on the plan
    const priceId =
      plan === "monthly"
        ? "price_1QMbReHP5U9UTpUiliMS4xjo"
        : "price_1QMbSCHP5U9UTpUi9LPlaAQF";

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    // update user
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          type: "premium",
          subscriptionId: subscription.id,
        },
      },
      { returnDocument: "after" }
    );

    return res.status(200).json({
      success: true,
      userType: user.type,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: { message: error.message } });
  }
};
