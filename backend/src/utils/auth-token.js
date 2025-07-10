import { ENV } from "../config/env.js";
import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
    return jwt.sign({ userId }, ENV.JWT_SECRET, {
        expiresIn: "1d"
    })
};

export const decodeToken = (token) => {
    return jwt.verify(token, ENV.JWT_SECRET);
}