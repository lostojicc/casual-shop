import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const shippingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0
    },
    shipping: {
        type: shippingSchema,
        required: true
    },
    //   subtotal: {
    //     type: Number,
    //     required: true,
    //     min: 0
    //   },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    paymentIntentId: {
        type: String
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema); 
export default Order;