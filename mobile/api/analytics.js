import api from "../utils/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const fetchKpis = async (from, to) => {
    const token = await AsyncStorage.getItem("accessToken");
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    
    const response = await api.get("/analytics/kpis", {
        params,
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const fetchMetricsOverTime = async (from, to) => {
    const token = await AsyncStorage.getItem("accessToken");
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    
    const response = await api.get("/analytics/metrics-over-time", {
        params,
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const fetchTopProducts = async (from, to, limit = 10) => {
    const token = await AsyncStorage.getItem("accessToken");
    const params = { limit };
    if (from) params.from = from;
    if (to) params.to = to;
    
    const response = await api.get("/analytics/top-products", {
        params,
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const fetchRevenueByCategory = async (from, to) => {
    const token = await AsyncStorage.getItem("accessToken");
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    
    const response = await api.get("/analytics/revenue-by-category", {
        params,
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
