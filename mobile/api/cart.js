import { useAuthStore } from "../store/authStore";
import api from "../utils/api.js";

export const getCartItems = async (token) => {   
    const response = await api.get("/cart", {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data;
};