import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductsByCategory, getSearchedProducts, updateQuantity } from "../controllers/product.controller";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);
router.patch("/update-quantity", updateQuantity);
router.get("/category", getProductsByCategory);
router.get("/search", getSearchedProducts);

export default router;