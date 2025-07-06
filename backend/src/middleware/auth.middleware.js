import { decodeToken } from "../utils/auth-token.js";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "You are not authenticated."
            });
        }

        try {
            const decoded = decodeToken(accessToken);

            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			throw error;
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
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