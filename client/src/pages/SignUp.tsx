import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRegister } from "@/hooks/useRegister";
import RegisterForm from "@/components/RegisterForm";
import { toast } from "sonner";
import { useEffect } from "react";
import reactLogo from "@/assets/react.svg";

export const SignUp = () => {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const { register, error } = useRegister();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleRegister = async (data: {
    user_name: string;
    email: string;
    password: string;
  }) => {
    const result = await register(data);
    if (result && result.user && result.token) {
      setAuth(result.user, result.token);
      if (result.user.user_name) {
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
            Sign Up
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Create your account to get started.
          </p>
        </div>
        <RegisterForm onSubmit={handleRegister} error={error || undefined} />
        <div className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
          <span>
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-[var(--primary)] hover:underline font-medium"
            >
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
