import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductsByCategory, getSearchedProducts, updateQuantity } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.patch("/update-quantity", protectRoute, adminRoute, updateQuantity);
router.get("/category", getProductsByCategory);
router.get("/search", getSearchedProducts);

export default router;