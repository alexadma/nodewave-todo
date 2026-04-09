import { axiosInstance } from "@/lib/axios";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth.types";

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post("/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post("/auth/register", payload);
    return data;
  },

  getMe: async () => {
    const { data } = await axiosInstance.get("/auth/me");
    return data;
  },
};