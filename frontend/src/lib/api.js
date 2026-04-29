import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API + "/api",
  withCredentials: true,
});

export default api;
