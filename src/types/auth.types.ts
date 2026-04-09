export interface User {
  id: string;
  fullName: string;   // ← API pakai fullName bukan name
  email: string;
  role: "USER" | "ADMIN";  // ← API pakai uppercase
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;   // ← sesuaikan dengan API
  email: string;
  password: string;
}