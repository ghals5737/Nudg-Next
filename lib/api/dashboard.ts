import type { ApiResponse, DashboardResponse } from "@/types/api"
import { apiClient } from "./client"

export const dashboardApi = {
  get: () =>
    apiClient.get<ApiResponse<DashboardResponse>>("/dashboard"),
}
