import { redis } from "../config/redis.js";
import { sendVerificationEmail } from "../utils/email/mailer.js";
import User from "../models/user.model.js";
import { generateToken } from "../utils/auth-token.js";

export const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    
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
};

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Your account is not verified."
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "You have successfully signed in.",
            user: {
				...user._doc,
				password: undefined,
			},
            token
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const verifyEmail = async (req, res) => {
    const { email, code } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false, 
                message: "User was not found." 
            });
        } 

        const verificationToken = await redis.get(`verify:${user._id}`);

        if (!verificationToken || verificationToken != code) {
            return res.status(400).json({
                success: false,
                message: "This code is invalid or expired."
            });
        }

        user.isVerified = true;
        await user.save();
        await redis.del(`verify:${user._id}`);


        res.status(202).json({
            success: true,
            message: "Account successfully verified.",
            user: {
				...user._doc,
				password: undefined,
			},
            token
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};