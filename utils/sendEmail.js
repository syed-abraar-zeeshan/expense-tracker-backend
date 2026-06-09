const nodemailer = require("nodemailer");
const logger = require("../config/logger");

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Expense Tracker App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text: message,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log(info);

  logger.info(`Email sent successfully to: ${email}`);
};

module.exports = sendEmail;
