import type {
  ApiResponse,
  CreateScheduleBlockRequest,
  ScheduleBlock,
  SnoozeRequest,
  UpdateScheduleBlockRequest,
} from "@/types/api"
import { apiClient } from "./client"

export const scheduleApi = {
  list: (date: string) =>
    apiClient.get<ApiResponse<ScheduleBlock[]>>(`/schedule?date=${date}`),

  get: (id: string) =>
    apiClient.get<ApiResponse<ScheduleBlock>>(`/schedule/${id}`),

  create: (body: CreateScheduleBlockRequest) =>
    apiClient.post<ApiResponse<ScheduleBlock>>("/schedule", body),

  update: (id: string, body: UpdateScheduleBlockRequest) =>
    apiClient.patch<ApiResponse<ScheduleBlock>>(`/schedule/${id}`, body),

  delete: (id: string) =>
    apiClient.delete<void>(`/schedule/${id}`),

  snooze: (id: string, body: SnoozeRequest) =>
    apiClient.post<ApiResponse<ScheduleBlock>>(`/schedule/${id}/snooze`, body),

  complete: (id: string) =>
    apiClient.patch<ApiResponse<ScheduleBlock>>(`/schedule/${id}`, { status: "completed" }),
}
