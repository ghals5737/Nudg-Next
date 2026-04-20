import type {
  ApiResponse,
  CBTEntry,
  CreateCBTEntryRequest,
  PaginatedResponse,
  UpdateCBTEntryRequest,
} from "@/types/api"
import { apiClient } from "./client"

export const cbtApi = {
  list: (page = 1, limit = 20) =>
    apiClient.get<PaginatedResponse<CBTEntry>>(`/cbt?page=${page}&limit=${limit}`),

  get: (id: string) =>
    apiClient.get<ApiResponse<CBTEntry>>(`/cbt/${id}`),

  create: (body: CreateCBTEntryRequest) =>
    apiClient.post<ApiResponse<CBTEntry>>("/cbt", body),

  update: (id: string, body: UpdateCBTEntryRequest) =>
    apiClient.patch<ApiResponse<CBTEntry>>(`/cbt/${id}`, body),

  delete: (id: string) =>
    apiClient.delete<void>(`/cbt/${id}`),
}
