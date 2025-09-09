import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

const buildOrderMatch = (from, to) => {
    const match = {};

    if (from || to) {
        match.createdAt = {};
        if (from) match.createdAt.$gte = new Date(from);
        if (to) match.createdAt.$lte = new Date(to);
    }

    return match;
}

export const getKpis = async (req, res) => {
    try {
        const { from, to } = req.query;
        const match = buildOrderMatch(from, to);

        const pipeline = [
            { $match: match },
            {
                $facet: {
                    gross: [
                        { $group: { _id: null, grossRevenue: { $sum: "$total" }, orders: { $sum: 1 } } }
                    ],
                    unitsAndDistinct: [
                        { $unwind: "$items" },
                        {
                            $group: {
                                _id: null,
                                unitsSold: { $sum: "$items.quantity" },
                                distinctProducts: { $addToSet: "$items.product" }
                            }
                        },
                        {
                            $project: {
                                unitsSold: 1,
                                distinctProductsSold: { $size: "$distinctProducts" }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    grossRevenue: { $ifNull: [{ $arrayElemAt: ["$gross.grossRevenue", 0] }, 0] },
                    orders: { $ifNull: [{ $arrayElemAt: ["$gross.orders", 0] }, 0] },
                    unitsSold: { $ifNull: [{ $arrayElemAt: ["$unitsAndDistinct.unitsSold", 0] }, 0] },
                    distinctProductsSold: { $ifNull: [{ $arrayElemAt: ["$unitsAndDistinct.distinctProductsSold", 0] }, 0] }
                }
            }
        ];

        const [r] = await Order.aggregate(pipeline);
        const grossRevenue = r?.grossRevenue || 0;
        const orders = r?.orders || 0;
        const unitsSold = r?.unitsSold || 0;
        const distinctProductsSold = r?.distinctProductsSold || 0;
        const aov = orders > 0 ? grossRevenue / orders : 0;

        return res.json({
            success: true,
            grossRevenue,
            orders,
            aov,
            unitsSold,
            distinctProductsSold
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getMetricsOverTime = async (req, res) => {
    try {
        const { from, to } = req.query;
        const match = buildOrderMatch(from, to);

        const pipeline = [
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d", timezone: "UTC" } },
                    revenue: { $sum: "$total" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ];

        const series = await Order.aggregate(pipeline);
        const total = series.reduce((s, d) => s + (d.revenue || 0), 0);
        return res.json({
            success: true,
            series: series.map(d => ({ date: d._id, revenue: d.revenue, orders: d.orders })),
            total
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getTopProductsByRevenue = async (req, res) => {
    try {
        const { from, to, limit = 10 } = req.query;
        const match = buildOrderMatch(from, to);

        const pipeline = [
            { $match: match },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                    units: { $sum: "$items.quantity" }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: Number(limit) },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $project: {
                    _id: 1,
                    revenue: 1,
                    units: 1,
                    name: { $ifNull: [{ $arrayElemAt: ["$product.name", 0] }, "Unknown product"] },
                    brand: { $ifNull: [{ $arrayElemAt: ["$product.brand", 0] }, ""] }
                }
            }
        ];

        const items = await Order.aggregate(pipeline);
        const totalRevenueTop = items.reduce((s, i) => s + (i.revenue || 0), 0);
        return res.json({ success: true, items, totalRevenueTop });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getRevenueByCategory = async (req, res) => {
    try {
        const { from, to } = req.query;
        const match = buildOrderMatch(from, to);

        const pipeline = [
            { $match: match },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "prod"
                }
            },
            { $unwind: "$prod" },
            {
                $lookup: {
                    from: "categories",
                    localField: "prod.category",
                    foreignField: "_id",
                    as: "cat"
                }
            },
            {
                $project: {
                    categoryId: { $ifNull: [{ $arrayElemAt: ["$cat._id", 0] }, "$prod.category"] },
                    categoryName: {
                        $ifNull: [{ $arrayElemAt: ["$cat.name", 0] }, { $toString: "$prod.category" }]
                    },
                    lineRevenue: { $multiply: ["$items.price", "$items.quantity"] }
                }
            },
            {
                $group: {
                    _id: { categoryId: "$categoryId", categoryName: "$categoryName" },
                    revenue: { $sum: "$lineRevenue" }
                }
            },
            { $sort: { revenue: -1 } },
            {
                $project: {
                    _id: 0,
                    categoryId: "$_id.categoryId",
                    categoryName: "$_id.categoryName",
                    revenue: 1
                }
            }
        ];

        const items = await Order.aggregate(pipeline);
        const totalRevenue = items.reduce((s, i) => s + (i.revenue || 0), 0);
        return res.json({ success: true, items, totalRevenue });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};