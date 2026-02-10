import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000",
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
