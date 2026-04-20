import type { ApiResponse, User, UserSettings } from "@/types/api"
import { apiClient } from "./client"

export const userApi = {
  get: () =>
    apiClient.get<ApiResponse<User>>("/user"),

  updateProfile: (body: Partial<Pick<User, "name" | "avatarUrl">>) =>
    apiClient.patch<ApiResponse<User>>("/user", body),

  updateSettings: (body: Partial<UserSettings>) =>
    apiClient.patch<ApiResponse<User>>("/user/settings", body),
}
