import Chat from "../models/Chat.js";

// Create new chat
export const createChat = async (req, res) => {
  try {
    const { chat_name, is_group = false, is_private = true } = req.body;

    if (!chat_name) {
      return res.status(400).json({ error: "Chat name is required" });
    }

    const newChat = new Chat({
      chat_name,
      is_group,
      is_private,
    });

    await newChat.save();

    res.status(201).json({
      message: "Chat created successfully",
      chat: newChat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
