import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export function useJoinRoomApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const joinRoomApi = async (roomId: string) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rooms/join`,
        { roomId },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      if (res.status === 200) {
        toast.info(res.data.message);
      }
      if (res.status === 201) {
        toast.info(res.data.message);
      }
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to join group");
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { joinRoomApi, loading, error, success };
}
