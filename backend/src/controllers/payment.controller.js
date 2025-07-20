import { stripe } from "../config/stripe.js";

export const createPaymentIntent = async (req, res) => {
    try {
        const { cartItems = [], email } = req.user;
        const { shippingAddress } = req.body;

        if (!Array.isArray(cartItems) || cartItems.length === 0) 
        return res.status(400).json({ error: 'Cart is empty or invalid.' });
        if (!shippingAddress || !shippingAddress.name || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) 
        return res.status(400).json({ error: 'Shipping address incomplete.' });

        const totalAmount = calculateTotalPrice(cartItems);

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
                userId: req.user._id.toString(),
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

const calculateTotalPrice = async (cartItems) => {
    let totalAmount = 0;

    cartItems.map(item => totalAmount += item.price * 100 * item.quantity);

    return totalAmount;
};

