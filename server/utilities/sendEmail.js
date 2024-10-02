const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function sendPasswordResetEmail(email, token, userName) {
  try {
    // Create reset link
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // HTML email template
    const htmlEmail = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4A90E2; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f8f8f8; padding: 20px; border-radius: 5px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
            <p>${resetLink}</p>
            <p>Best regards,<br>The Convo Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: '"Convo Support" <support@convo.com>',
      to: email,
      subject: "Password Reset Request",
      html: htmlEmail,
    });

    return {
      success: true,
      message: "Password reset email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { error: "An error occurred while processing your request." };
  }
}
