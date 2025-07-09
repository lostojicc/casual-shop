import express from "express";
import { getAllCategories } from "../controllers/category.controller.js";
import { getCategoryByName } from "../../../mobile/api/categories.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:name", getCategoryByName);

export default router;