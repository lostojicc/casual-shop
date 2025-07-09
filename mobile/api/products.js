import api from "../utils/api"

export const fetchProductsByCategory = async (categoryId) => {
    const response = await api.get("/products/category", {
        params: {
            category: categoryId
        }
    });

    return response.data.products;
}