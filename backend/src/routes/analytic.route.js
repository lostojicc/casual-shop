import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getKpis, getMetricsOverTime, getRevenueByCategory, getTopProductsByRevenue } from "../controllers/analytic.controller.js";

const router = express.Router();

router.get("/kpis", protectRoute, adminRoute, getKpis);
router.get("/metrics-over-time", protectRoute, adminRoute, getMetricsOverTime);
router.get("/top-products", protectRoute, adminRoute, getTopProductsByRevenue);
router.get("/revenue-by-category", protectRoute, adminRoute, getRevenueByCategory);

export default router;