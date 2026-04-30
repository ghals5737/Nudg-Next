import type {
  ApiResponse,
  CreateRoutineRequest,
  Routine,
  RoutineRhythmResponse,
  RoutineWithRhythm,
  TodayRoutinesResponse,
  UpdateRoutineRequest,
} from "@/types/api"
import { apiClient } from "./client"

export const routinesApi = {
  list: () =>
    apiClient.get<ApiResponse<RoutineWithRhythm[]>>("/routines"),

  today: () =>
    apiClient.get<ApiResponse<TodayRoutinesResponse>>("/routines/today"),

  get: (id: string) =>
    apiClient.get<ApiResponse<Routine>>(`/routines/${id}`),

  create: (body: CreateRoutineRequest) =>
    apiClient.post<ApiResponse<Routine>>("/routines", body),

  update: (id: string, body: UpdateRoutineRequest) =>
    apiClient.patch<ApiResponse<Routine>>(`/routines/${id}`, body),

  toggle: (id: string) =>
    apiClient.patch<ApiResponse<Routine>>(`/routines/${id}/toggle`, {}),

  delete: (id: string) =>
    apiClient.delete<void>(`/routines/${id}`),

  logCompletion: (id: string, date: string) =>
    apiClient.post<ApiResponse<void>>(`/routines/${id}/log`, { date }),

  unlogCompletion: (id: string, date: string) =>
    apiClient.delete<void>(`/routines/${id}/log?date=${date}`),

  getRhythm: (id: string, days = 7) =>
    apiClient.get<ApiResponse<RoutineRhythmResponse>>(`/routines/${id}/rhythm?days=${days}`),
}
