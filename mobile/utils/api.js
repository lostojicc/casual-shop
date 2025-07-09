import axios from "axios";

const api = axios.create({
    baseURL: "https://casual-shop.onrender.com/api",
    withCredentials: true
});

export default api;