import { useState } from "react";
import axios from "axios";

export function useCreateRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);

  const createRoom = async (groupName: string) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rooms`,
        { room_name: groupName },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      setRoomId(response.data.room_id);
      return response.data.id;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create room");
      setRoomId(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createRoom, loading, error, roomId };
}
