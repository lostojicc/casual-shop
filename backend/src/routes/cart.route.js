import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addToCart, getCartProducts, removeFromCart, updateQuantity } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.delete("/", protectRoute, removeFromCart);
router.post("/", protectRoute, addToCart);
router.patch("/:id", protectRoute, updateQuantity);

export default router;