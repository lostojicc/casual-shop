import Order from "../models/order.model.js";

export const getUserOrderHistory = async (req, res) => {
    try {
        const user = req.user;

        const orders = await Order.find({ user: user._id })
            .populate("items.product", "brand name image")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).json({ message: "Failed to fetch order history" });
    }
};