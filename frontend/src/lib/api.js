import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: BASE_URL + "/api",
  withCredentials: true,
});

export default api;
