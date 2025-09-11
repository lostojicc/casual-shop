import api from "../utils/api.js"

export const fetchUserOrderHistory = async (token) => {
    const response = await api.get("/orders/user-order-history", {
        headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
};