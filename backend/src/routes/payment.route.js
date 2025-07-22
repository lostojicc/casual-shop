import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createIntent, onPaymentSuccess } from "../controllers/payment.controller.js";
import { verifyPayment } from "../middleware/payment.middleware.js";

const router = express.Router();

router.post("/create-intent", protectRoute, createIntent);
router.post("/success", express.raw({ type: "application/json" }), verifyPayment, onPaymentSuccess);

export default router;