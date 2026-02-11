import api from "@/lib/api";
import type { LoginData, SignupData } from "./auth.schema";

export const authAPI = {
  login: async (data: LoginData) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  signup: async (data: SignupData) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },
};
