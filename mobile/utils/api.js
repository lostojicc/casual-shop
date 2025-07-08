import axios from "axios";

const api = axios.create({
    baseURL: "https://casual-shop.onrender.com/api"
});

export default api;