import { stripe } from "../config/stripe.js";
import Product from "../models/product.model.js";

export const createPaymentIntent = async (req, res) => {
    try {
        const { cartItems = [], email } = req.user;
        const { shippingAddress } = req.body;

        if (!Array.isArray(cartItems) || cartItems.length === 0) 
        return res.status(400).json({ error: 'Cart is empty or invalid.' });
        if (!shippingAddress || !shippingAddress.name || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) 
        return res.status(400).json({ error: 'Shipping address incomplete.' });

        const productIds = cartItems.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });
        
        const productMap = products.reduce((map, product) => {
            map[product._id.toString()] = product;
            return map;
        }, {});

        // Calculate total using the fetched product prices
        const totalAmount = cartItems.reduce((total, item) => {
            const product = productMap[item.product.toString()];
            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            }
            return total + (product.price * 100 * item.quantity);
        }, 0);

        // Validate total amount
        if (isNaN(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({ error: 'Invalid total amount calculated.' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'eur',
            automatic_payment_methods: { enabled: true },
            receipt_email: email,
            shipping: {
                name: shippingAddress.name,
                phone: shippingAddress.phone,
                address: {
                    line1: shippingAddress.line1,
                    line2: shippingAddress.line2 || '',
                    city: shippingAddress.city,
                    postal_code: shippingAddress.postalCode,
                    country: shippingAddress.country
                }
            },
            metadata: {
                userId: req.user._id,
                products: JSON.stringify(
                    cartItems.map(item => ({
                        id: item._id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                )
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            totalAmount
        });
    } catch (error) {
        console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
    }
};