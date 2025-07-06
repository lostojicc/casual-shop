import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { brand, name, description, price, image, category } = req.body;

        let cloudinaryResponse = null;

        if (image) 
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });

        const product = await Product.create({
            brand, 
            name, 
            description,
            price,
            category,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "" 
        });

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];

            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
            } catch (error) {
                console.log("Error deleting image from cloudinary", error);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const updateQuantity = async (req, res) => {
    const { productId, newQuantity } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            quantity: newQuantity
        }, {
            new: true,
            runValidators: true
        });

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Quantity was successfully updated.",
            updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { category } = req.query;

    try {
        const products = await Product.find({ category }).populate('category');
        res.status(200).json({ 
            success: true, 
            products 
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

export const getSearchedProducts = async (req, res) => {
    const { search } = req.query;

    try {
        const query = {};

        if (search) {
            const words = search.trim().split(/\s+/).filter(Boolean);

            if (words.length > 0) {
                query.$and = words.map(word => ({
                    $or: [
                        { name: { $regex: word, $options: "i" } },
                        { brand: { $regex: word, $options: "i" } }
                    ]
                }));
            }
        }

        const products = await Product.find(query);
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};