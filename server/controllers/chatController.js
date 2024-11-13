import { StreamChat } from "stream-chat";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Gemini and StreamChat client with API key and secret
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

let defaultContext = `You are ConvoAI, a helpful and friendly assistant. Your job is to assist users with their queries in a clear and concise manner. Always be polite and friendly. Respond based on general knowledge, unless the user asks for something more specific.\n
  User Query: `;

// Function to create or retrieve the ConvoAI channel
async function getOrCreateConvoAIChannel(userId) {
  const channelId = `${userId}_convoAI`;
  const channel = serverClient.channel("messaging", channelId, {
    created_by_id: userId,
    members: [userId, "convoAI"],
  });
  await channel.create();
  return channel;
}

// Function to get AI response from Gemini
async function getGeminiResponse(query) {
  const prompt = `${defaultContext}${query}`;

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  return result.response.text();
}

// Endpoint to handle user message to ConvoAI
export async function handleConvoAIQuery(req, res) {
  const { userId, message } = req.body;

  try {
    const channel = await getOrCreateConvoAIChannel(userId);

    // Forward user message to Gemini AI
    const aiResponse = await getGeminiResponse(message);

    // Send AI response as a message in Stream Chat
    await channel.sendMessage({
      text: aiResponse,
      user_id: "convoAI",
    });

    return res.status(200).json({ success: true, response: aiResponse });
  } catch (error) {
    console.error("Error handling user message:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}
