import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function fetchAllTasks() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/api/auth/my-todos`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}
