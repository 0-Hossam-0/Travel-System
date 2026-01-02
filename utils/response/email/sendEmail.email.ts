import nodemailer from "nodemailer";
import { EmailOptions } from "./email.types";

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  console.log(process.env.EMAIL_HOST);
  console.log("Email User:", process.env.EMAIL_USER);
  console.log("Email Pass:", process.env.EMAIL_PASS ? "****" : "MISSING");
  const transporter = nodemailer.createTransport({
    secure: false,
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Travel Platform <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};
