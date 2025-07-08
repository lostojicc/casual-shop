import api from "../utils/api"

export const getAllCategories = async () => {
    const response = await api.get("/categories");
    return response.data.categories;
}