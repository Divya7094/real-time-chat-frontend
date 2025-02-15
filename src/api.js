import axios from "axios";
import { getToken } from "./utils/auth";

const API = axios.create({
  baseURL: "https://real-time-chat-app-backend-l2sp.onrender.com/",  // ✅ Replace with actual Render backend URL
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
