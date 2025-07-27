// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // adjust for your backend URL
  withCredentials: true, // if using cookies
});

export default api;
