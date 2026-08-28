import { axiosInstance } from "@/lib/axios";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth.types";

/** Normalize API response – backend may wrap in .data or .content */
function extractAuth(res: any): AuthResponse {
  const body = res.data;
  return body?.data ?? body?.content ?? body;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await axiosInstance.post("/login", payload);
    return extractAuth(res);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await axiosInstance.post("/register", payload);
    return extractAuth(res);
  },

  getMe: async () => {
    const res = await axiosInstance.get("/me");
    const body = res.data;
    return body?.data ?? body?.content ?? body;
  },
};