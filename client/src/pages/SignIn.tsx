import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "@/components/LoginForm";
import { useLogin } from "../hooks/useLogin";
import { useEffect } from "react";
import { toast } from "sonner";
import reactLogo from "@/assets/react.svg";

export const SignIn = () => {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const { login, error } = useLogin();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleLogin = async (data: { email: string; password: string }) => {
    console.log("handleLogin called with:", data);
    const result = await login(data);
    console.log("Login result:", result);
    if (result && result.user && result.token) {
      setAuth(result.user, result.token);
      // Set user_name in localStorage if not present
      if (!localStorage.getItem("user_name") && result.user.user_name) {
        localStorage.setItem("user_name", result.user.user_name);
      }
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-[#18181b] dark:via-[#23272f] dark:to-[#18181b]">
      <div className="bg-[var(--card)] p-8 rounded-2xl shadow-2xl w-full max-w-md text-[var(--card-foreground)] border border-[var(--border)] relative">
        <div className="flex flex-col items-center mb-6">
          <img src={reactLogo} alt="Logo" className="h-12 w-12 mb-2" />
          <h2 className="text-3xl font-extrabold text-center text-[var(--foreground)] mb-1">
            Sign In
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Welcome back! Please sign in to your account.
          </p>
        </div>
        <LoginForm onSubmit={handleLogin} error={error || undefined} />
        <div className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
          <span>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[var(--primary)] hover:underline font-medium"
            >
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
