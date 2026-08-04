import axios from "axios";

const API = axios.create({
  baseURL: "https://job-portal-1-1siw.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;