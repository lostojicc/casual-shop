import Category from "../models/category.model"

export const getAllCategories = async (req, res) => {
    try {
        const categories = Category.find();
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}