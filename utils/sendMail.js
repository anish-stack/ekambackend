const nodemailer = require("nodemailer");
require("dotenv").config()
const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host:process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: options.email,
      subject: options.subject,
      html: options.message, 
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;