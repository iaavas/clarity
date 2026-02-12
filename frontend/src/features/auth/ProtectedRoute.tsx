import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "./useCurrentUser";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

export function ProtectedRoute() {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) return <LoadingFallback />;
  if (isError || !user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
