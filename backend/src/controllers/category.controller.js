import Category from "../models/category.model.js"

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
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
};

export const getCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;
        const category = await Category.find({ name })[0];

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};