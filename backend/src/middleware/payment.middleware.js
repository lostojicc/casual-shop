import { ENV } from "../config/env.js";
import { stripe } from "../config/stripe.js";

export const verifyPayment = (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    
    try {
        req.event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            message: "Stripe payment not verified."
        });
    }
};