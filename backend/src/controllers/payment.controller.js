import { stripe } from "../config/stripe.js";
import Product from "../models/product.model.js";

export const createIntent = async (req, res) => {
    try {
        var args = {
            amount: 1099,
            currency: 'usd',
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {enabled: true}
        };
        const intent = await stripe.paymentIntents.create(args);
        res.json({
            client_secret: intent.client_secret,
        });
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message })
    }
};