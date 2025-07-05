import { redis } from "../config/redis.js";
import { sendVerificationEmail } from "../email/mailer.js";
import User from "../models/user.model.js";

export const signUp = async (req, res) => {
    const { name, email, password} = req.body;
    
    try {
        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            return res.status(409).json({
                success: false,
                message: "This email is being used."
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        await redis.set(`verify:${user._id}`, verificationToken, "EX", 900);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "Your account was successfully created",
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export const signIn = async (req, res) => {
    res.send("Sign In route");
}

export const signOut = async (req, res) => {
    res.send("Sign Out route");
}