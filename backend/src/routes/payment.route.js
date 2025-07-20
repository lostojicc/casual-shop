import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createIntent } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-intent", protectRoute, createIntent);

export default router;