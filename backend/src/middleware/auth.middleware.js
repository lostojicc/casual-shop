import { decodeToken } from "../utils/auth-token.js";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // get token
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }

    // verify token
    const decoded = decodeToken(token);

    // find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Token is not valid" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin")
        next();
    else {
        return res.status(403).json({
            success: false,
            message: "Access denied - Admin only"
        });
    }
};