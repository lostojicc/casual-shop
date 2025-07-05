import nodemailer from "nodemailer";
import fs from "fs";
import { ENV } from "../../config/env.js";
import path from "path";
import { fileURLToPath } from "url";

// This is needed in ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to verification.html
const filePath = path.join(__dirname, "templates", "verification.html");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,         
    pass: ENV.EMAIL_PASSWORD,      
  },
});

export const sendVerificationEmail = async (to, token) => {
  let html = fs.readFileSync(filePath, "utf8");
  html = html.replace("{{token}}", token);

  await transporter.sendMail({
    from: 'Casual Shop',
    to,
    subject: "Verify your account",
    html
  });
};