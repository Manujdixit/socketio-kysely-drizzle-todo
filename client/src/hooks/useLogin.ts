import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      console.log(
        "Attempting login to:",
        `${import.meta.env.VITE_API_URL}/api/auth/login`
      );
      console.log("Request data:", data);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      console.log("Response received:", res.status, res.statusText);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }
      const { user, token } = await res.json();
      localStorage.setItem("manuj_user_id", user.user_id);
      setLoading(false);
      return { user, token };
    } catch (e: any) {
      console.error("Login error:", e);
      if (e.name === "AbortError") {
        setError("Request timeout - server may be down");
      } else if (e.message.includes("fetch")) {
        setError("Network error - cannot connect to server");
      } else {
        setError(e.message || "Login failed");
      }
      setLoading(false);
      return null;
    }
  };

  return { login, loading, error };
}
