import { axiosInstance } from "@/lib/axios";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth.types";

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post("/login", payload);
    return data.content; // ← API wrap response di dalam "content"
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post("/register", payload);
    return data.content;
  },

  getMe: async () => {
    const { data } = await axiosInstance.get("/me");
    return data.content;
  },
};