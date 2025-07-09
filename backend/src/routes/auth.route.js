import express from "express";
import { checkAuth, signIn, signOut, signUp, verifyEmail } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/verify-email", verifyEmail);
router.get("/check", protectRoute, checkAuth)

export default router;