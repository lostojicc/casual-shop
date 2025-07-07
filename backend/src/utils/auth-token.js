import { ENV } from "../config/env.js";
import jwt from "jsonwebtoken";

export const setCookie = (res, userId) => {
    res.cookie("accessToken", generateToken(userId), {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });
};

const generateToken = (userId) => {
    return jwt.sign({ userId }, ENV.JWT_SECRET, {
        expiresIn: "1d"
    })
};

export const decodeToken = (token) => {
    return jwt.verify(token, ENV.JWT_SECRET);
}