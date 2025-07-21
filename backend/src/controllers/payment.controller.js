import { stripe } from "../config/stripe.js";
import Product from "../models/product.model.js";

export const createIntent = async (req, res) => {
    try {
        const cartItems = req.user.cartItems;
        const productIds = cartItems.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });

        const cartWithPrices = cartItems.map(item => {
            const product = products.find(p => p._id.toString() === item.product.toString());
            return {
                ...item,
                price: product ? product.price : 0
            }
        });

        const totalAmount = calculateTotalPrice(cartWithPrices);

        var args = {
            amount: totalAmount,
            currency: 'eur',
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {enabled: true},
            metadata: {
                userId: req.user._id,
                products: JSON.stringify(cartWithPrices.map(item => ({
                    id: item.product,
                    quantity: item.quantity,
                    price: item.price
                })))
            }
        };
        const intent = await stripe.paymentIntents.create(args);
        res.json({
            client_secret: intent.client_secret,
        });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

const calculateTotalPrice = (cart) => {
    const totalPrice = cart.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity);
    return totalPrice;
}