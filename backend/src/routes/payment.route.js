import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-payment-intent", protectRoute, createPaymentIntent);

export default router;