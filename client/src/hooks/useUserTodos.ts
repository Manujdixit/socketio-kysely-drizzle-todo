import { fetchAllTasks } from "@/api/tasks";
import { useEffect, useState } from "react";

export function useUserTodos() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchAllTasks()
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Failed to fetch tasks");
        setLoading(false);
      });
  }, []);

  return { tasks, setTasks, loading, error };
}
