import nodemailer from "nodemailer";
import fs from "fs";
import { ENV } from "../../config/env.js";
import path from "path";
import { fileURLToPath } from "url";

// This is needed in ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to verification.html
const verificationTemplateFilePath = path.join(__dirname, "templates", "verification.html");
const orderTemplateFilePath = path.join(__dirname, "templates", "order.html");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (to, token) => {
  let html = fs.readFileSync(verificationTemplateFilePath, "utf8");
  html = html.replace("{{token}}", token);

  await transporter.sendMail({
    from: 'Casual Shop',
    to,
    subject: "Verify your account",
    html
  });
};

export const sendOrderConfirmationEmail = async (to, order) => {
  let html = fs.readFileSync(orderTemplateFilePath, "utf8");

  // Generate items HTML
  const itemsHtml = order.items
    .map(
      (i) =>
        `<li>${i.quantity} × ${i.product.brand} ${i.product.name} (€${i.price.toFixed(2)} each)</li>`
    )
    .join("");

  html = html
    .replace("{{name}}", order.shipping.name)
    .replace("{{orderId}}", order._id)
    .replace("{{items}}", itemsHtml)
    .replace("{{shippingName}}", order.shipping.name)
    .replace("{{shippingLine1}}", order.shipping.line1)
    .replace("{{shippingLine2}}", order.shipping.line2 || "")
    .replace("{{shippingCity}}", order.shipping.city)
    .replace("{{shippingPostalCode}}", order.shipping.postalCode)
    .replace("{{shippingCountry}}", order.shipping.country)
    .replace("{{shippingPhone}}", order.shipping.phone)
    .replace("{{total}}", order.total.toFixed(2));

  await transporter.sendMail({
    from: "Casual Shop",
    to,
    subject: `Your Order Confirmation - ${order._id}`,
    html,
  });
};