import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { LoginPayload, RegisterPayload } from "@/types/auth.types";

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ token, user }) => {
      setAuth(user, token);
      toast.success("Login berhasil!");
      router.push("/todos");
    },
    onError: () => toast.error("Email atau password salah"),
  });
};

export const useRegister = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: ({ token, user }) => {
      setAuth(user, token);
      toast.success("Registrasi berhasil!");
      router.push("/todos");
    },
    onError: () => toast.error("Registrasi gagal, coba lagi"),
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  return () => {
    clearAuth();
    toast.success("Logout berhasil");
    router.push("/login");
  };
};