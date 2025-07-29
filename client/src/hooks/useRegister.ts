import { useState } from "react";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: {
    user_name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }
      const { user, token } = await res.json();
      setLoading(false);
      return { user, token };
    } catch (e: any) {
      setError(e.message || "Registration failed");
      setLoading(false);
      return null;
    }
  };

  return { register, loading, error };
}
