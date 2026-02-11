import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { authAPI } from "./auth.api";

export function useCurrentUser() {
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ["me"],
    queryFn: () => authAPI.me(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (
      query.isError &&
      query.error &&
      isAxiosError(query.error) &&
      query.error.response?.status === 401
    ) {
      navigate("/login", { replace: true });
    }
  }, [query.isError, query.error, navigate]);

  return query;
}
