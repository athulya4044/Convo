import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function sendPasswordResetEmail({ email, token, userName }) {
  try {
    // Create reset link
    const resetLink = `http://localhost:5173/reset-password/${token}`;

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
    const info = await transporter.sendMail({
      from: '"Convo Support" <support@convo.com>',
      to: email,
      subject: "Password Reset Request",
      html: htmlEmail,
    });

    log("Message sent: %s", info.messageId);
    return {
      success: true,
      message: "Password reset email sent successfully.",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      error: "An error occurred while processing your request.",
      details: error.message,
      code: error.code,
    };
  }
}

export async function sendPremiumUpgradeEmail({ email, userName }) {
  const dashboard = `http://localhost:5173/dashboard`;
  try {
    // HTML email template
    const htmlEmail = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Premium Membership Upgrade</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4A90E2; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f8f8f8; padding: 20px; border-radius: 5px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 5px; }
          .image { text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Congratulations on Upgrading to Premium!</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>We're thrilled to welcome you to the Premium Membership! 🎉</p>
            <p>As a premium member, you now have access to exclusive features designed to enhance your experience. Explore all the benefits waiting for you:</p>
            <p style="text-align: center;">
              <a href="${dashboard}" class="button">Explore Premium Features</a>
            </p>
            <p>If you have any questions or need assistance, feel free to reach out to our support team at any time.</p>
            <p>Thank you for choosing to be a part of our Premium community!</p>
            <p>Best regards,<br>The Convo Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: '"Convo Support" <support@convo.com>',
      to: email,
      subject: "Welcome to Premium Membership!",
      html: htmlEmail,
    });

    console.log("Message sent: %s", info.messageId);
    return {
      success: true,
      message: "Premium membership email sent successfully.",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending premium membership email:", error);
    return {
      error: "An error occurred while processing your request.",
      details: error.message,
      code: error.code,
    };
  }
}

// Test the connection
transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP connection error:", error);
  } else {
    console.log("SMTP connection is ready to take our messages");
  }
});
