import React from "react";
import { Loader } from "./ui/loader";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginForm: React.FC<{
  onSubmit: (data: LoginFormInputs) => void;
  error?: string;
}> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium text-[var(--foreground)]">
          Email address
        </label>
        <input
          type="email"
          {...register("email")}
          className="w-full px-3 py-2 bg-[var(--input)] border border-[var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)]"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-[var(--destructive)]">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <label className="block mb-1 font-medium text-[var(--foreground)]">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className="w-full px-3 py-2 bg-[var(--input)] border border-[var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)]"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-[var(--destructive)]">
            {errors.password.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded font-semibold hover:bg-[color-mix(in_oklch,var(--primary),black_10%)] transition flex justify-center items-center"
      >
        {isSubmitting ? <Loader /> : "Sign In"}
      </button>
    </form>
  );
};
export default LoginForm;
