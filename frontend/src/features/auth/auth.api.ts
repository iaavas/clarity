import api from "@/lib/api";
import type { LoginData, SignupData } from "./auth.schema";

export type User = { id: string; email: string };

export const authAPI = {
  login: async (data: LoginData) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  signup: async (data: SignupData) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get<{ data: User }>("/auth/me");
    return response.data.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },
};
