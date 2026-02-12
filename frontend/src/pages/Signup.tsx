import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { signupSchema, type SignupFormData } from "@/features/auth/auth.schema";
import { authAPI } from "@/features/auth/auth.api";
import { getErrorMessage } from "@/lib/api";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError("");
    setLoading(true);
    try {
      await authAPI.signup({
        email: data.email,
        password: data.password,
      });
      navigate("/login");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Signup failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background font-sans antialiased">
      <div className="relative hidden w-0 flex-1 bg-muted lg:block">
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            Clarity
          </div>
          <div className="max-w-md">
            <blockquote className="space-y-2">
              <p className="text-3xl font-medium leading-tight tracking-tight">
                "The simplest way to track your expenses and gain financial
                freedom."
              </p>
            </blockquote>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:flex-none lg:px-20 xl:px-24">
        <div className="absolute right-8 top-8">
          <ThemeSwitch />
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive ring-1 ring-inset ring-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="h-11 border-input bg-background transition-all focus-visible:ring-1 focus-visible:ring-primary"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-xs font-medium text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Password
              </Label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                className="h-11 border-input bg-background transition-all focus-visible:ring-1 focus-visible:ring-primary"
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-xs font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Confirm password
              </Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="••••••••"
                className="h-11 border-input bg-background transition-all focus-visible:ring-1 focus-visible:ring-primary"
                {...register("confirmPassword")}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
              />
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="group relative flex w-full h-11 items-center justify-center overflow-hidden rounded-md bg-primary font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating account...
                </span>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>

          <footer className="mt-20">
            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
