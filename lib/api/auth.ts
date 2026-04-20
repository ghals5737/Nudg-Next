import type { AuthResponse, LoginRequest, SignupRequest, User } from "@/types/api"
import { apiClient } from "./client"

export const authApi = {
  signup: (body: SignupRequest) =>
    apiClient.post<AuthResponse>("/auth/signup", body),

  
  login: (body: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", body),

  logout: () =>
    apiClient.post<void>("/auth/logout", {}),

  me: () =>
    apiClient.get<{ data: User }>("/auth/me"),
}
