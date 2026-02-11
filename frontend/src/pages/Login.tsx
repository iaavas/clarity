import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authAPI } from "@/features/auth/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { loginSchema, type LoginFormData } from "@/features/auth/auth.schema";
import { getErrorMessage } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setLoading(true);
    try {
      await authAPI.login(data);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="absolute right-4 top-4">
        <ThemeSwitch />
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              Clarity
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Your personal expense tracking app
            </p>
            <p className="mt-1 text-xs text-muted-foreground/80 sm:text-sm">
              Understand your finances better and make smarter financial
              decisions
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6  sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Login</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-violet-600 text-white hover:bg-violet-700"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-violet-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
