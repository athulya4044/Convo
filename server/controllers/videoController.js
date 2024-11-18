import jwt from 'jsonwebtoken';

export const generateVideoToken = (req, res) => {
  const { userId } = req.body;

  try {
    // Generate the token using the Stream API Secret
    const token = jwt.sign(
      { user_id: userId }, // Payload
      process.env.STREAM_API_SECRET, // Stream API Secret
      { algorithm: 'HS256', expiresIn: '24h' } // Options
    );

    res.json({ token });
  } catch (error) {
    console.error('Error generating video token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};
