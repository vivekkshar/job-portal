import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? "http://localhost:3000/api"
      : "https://job-portal-1-1siw.onrender.com/api"),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;