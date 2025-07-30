import { useEffect, useState } from "react";
import axios from "axios";

export function useUserGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGroups() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rooms`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
        setGroups(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  return { groups, loading, error };
}
