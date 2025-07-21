import { stripe } from "../config/stripe.js";
import Product from "../models/product.model.js";

export const createIntent = async (req, res) => {
    try {
        const { shippingAddress } = req.body;
        const cartItems = req.user.cartItems;
        
        const productIds = cartItems.map(item => item._id);
        const products = await Product.find({ _id: { $in: productIds } });
        
        const cartWithPrices = cartItems.map(item => {
            const plainItem = item.toObject();
            const product = products.find(p => p._id.toString() === item._id.toString());
            return {
                ...plainItem,
                price: product ? product.price : 0
            }
        });
        
        const totalAmount = calculateTotalPrice(cartWithPrices);
        console.log(totalAmount);
        var args = {
            amount: totalAmount,
            currency: 'eur',
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {enabled: true},
            shipping: {
                name: req.body.shippingAddress.name,
                address: {
                    line1: req.body.shippingAddress.line1,
                    line2: req.body.shippingAddress.line2 || '',
                    city: req.body.shippingAddress.city,
                    postal_code: req.body.shippingAddress.postalCode,
                    country: req.body.shippingAddress.country
                },
                phone: req.body.shippingAddress.phone || ''
            },
            metadata: {
                userId: req.user._id,
                products: JSON.stringify(cartWithPrices.map(item => ({
                    id: item._id,
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
    const totalPrice = cart.reduce((sum, item) => {
        console.log(item);
        return sum + Math.round(item.price * 100) * item.quantity;
    }, 0);
    return totalPrice;
}