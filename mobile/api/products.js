import api from "../utils/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const fetchProductsByCategory = async (categoryId) => {
    const response = await api.get("/products/category", {
        params: {
            category: categoryId
        }
    });

    return response.data.products;
};

export const fetchFeaturedProducts = async () => {
    const response = await api.get("/products/featured");
    return response.data;
};

export const fetchSearchProducts = async (search) => {
    const response = await api.get("/products/search", {
        params: {
            search: search
        }
    });
    return response.data.products;
};

export const addProduct = async (data) => {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await api.post(
        "/products",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.product;
};

export const fetchAllProductsAdmin = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await api.get(
        "/products",
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.products || response.data || [];
};

export const updateProductQuantityAdmin = async (productId, newQuantity) => {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await api.patch(
        "/products/update-quantity",
        { productId, newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.updatedProduct;
};

export const deleteProductAdmin = async (productId) => {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await api.delete(
        `/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};