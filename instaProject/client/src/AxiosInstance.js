import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // your backend base URL
  withCredentials: true, // always send cookies
});

export default api;
