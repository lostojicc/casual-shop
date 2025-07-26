import api from "../utils/api"

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
}