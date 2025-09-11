import { stripe } from "../config/stripe.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { sendOrderConfirmationEmail } from "../utils/email/mailer.js";

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

        var args = {
            amount: totalAmount,
            currency: 'eur',
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: { enabled: true },
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
                userId: req.user._id.toString(),
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
        return sum + Math.round(item.price * 100) * item.quantity;
    }, 0);
    return totalPrice;
};

export const onPaymentSuccess = async (req, res) => {
    try {
        const paymentIntent = req.event.data.object;

        const products = JSON.parse(paymentIntent.metadata.products);
        const userId = paymentIntent.metadata.userId;
        const shipping = paymentIntent.shipping || {};
        const shippingInfo = {
            name: shipping.name,
            phone: shipping.phone,
            line1: shipping.address?.line1,
            line2: shipping.address?.line2,
            city: shipping.address?.city,
            postalCode: shipping.address?.postal_code,
            country: shipping.address?.country
        };
        const total = paymentIntent.amount / 100;

        const order = await Order.create({
            user: userId,
            items: products.map(item => ({
                product: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            shipping: {
                name: shippingInfo.name,
                phone: shippingInfo.phone,
                line1: shippingInfo.line1,
                line2: shippingInfo.line2,
                city: shippingInfo.city,
                postalCode: shippingInfo.postalCode,
                country: shippingInfo.country
            },
            total,
            paymentIntentId: paymentIntent.id
        });

        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { quantity: -item.quantity } } 
            );
        }

        const productIds = order.items.map(i => i.product);
        const productsData = await Product.find({ _id: { $in: productIds } });

        const itemsWithProductData = order.items.map(i => {
            const product = productsData.find(p => p._id.toString() === i.product.toString());
            return {
                ...i.toObject(),
                product: product ? { name: product.name, brand: product.brand } : { name: '', brand: '' }
            };
        });

        const user = await User.findById(userId);
        await sendOrderConfirmationEmail(user.email, {
            ...order.toObject(),
            items: itemsWithProductData
        });

        res.status(200).json({
            message: "Payment successful, order created",
            orderId: order._id
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error. Error processing successful checkout."
        })
    }
};

