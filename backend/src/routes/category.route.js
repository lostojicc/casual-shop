import express from "express";
import { getAllCategories, getCategoryByName } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:name", getCategoryByName);

export default router;