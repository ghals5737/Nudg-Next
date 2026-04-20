import type {
  ApiResponse,
  CreateGoalRequest,
  Goal,
  UpdateGoalRequest,
  UpdateGoalStepRequest,
} from "@/types/api"
import { apiClient } from "./client"

export const goalsApi = {
  list: () =>
    apiClient.get<ApiResponse<Goal[]>>("/goals"),

  get: (id: string) =>
    apiClient.get<ApiResponse<Goal>>(`/goals/${id}`),

  create: (body: CreateGoalRequest) =>
    apiClient.post<ApiResponse<Goal>>("/goals", body),

  update: (id: string, body: UpdateGoalRequest) =>
    apiClient.patch<ApiResponse<Goal>>(`/goals/${id}`, body),

  delete: (id: string) =>
    apiClient.delete<void>(`/goals/${id}`),

  updateStep: (goalId: string, stepId: string, body: UpdateGoalStepRequest) =>
    apiClient.patch<ApiResponse<Goal>>(`/goals/${goalId}/steps/${stepId}`, body),
}
