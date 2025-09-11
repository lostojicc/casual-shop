import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserOrderHistory } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/user-order-history", protectRoute,  getUserOrderHistory);

export default router;