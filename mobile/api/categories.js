import api from "../utils/api"

export const getAllCategories = async () => {
    const response = await api.get("/categories");
    return response.data.categories;
}

export const getCategoryByName = async (name) => {
    const response = await api.get(`/categories/${name}`);
    return response.data.category;
}