import { apiClient, API_ROUTES } from "@/lib/api-client";
import type {
  Doctor,
  CreateDoctorPayload,
  DoctorListResponse,
} from "../types";

export const doctorService = {
  async list(params?: { page?: number; limit?: number; search?: string }) {
    return apiClient<DoctorListResponse>(API_ROUTES.DOCTORS.LIST, {
      params: params as Record<string, string>,
    });
  },

  async getById(id: string) {
    return apiClient<Doctor>(API_ROUTES.DOCTORS.BY_ID(id));
  },

  async create(payload: CreateDoctorPayload) {
    return apiClient<Doctor>(API_ROUTES.DOCTORS.CREATE, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: Partial<CreateDoctorPayload>) {
    return apiClient<Doctor>(API_ROUTES.DOCTORS.BY_ID(id), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async delete(id: string) {
    return apiClient<void>(API_ROUTES.DOCTORS.BY_ID(id), {
      method: "DELETE",
    });
  },
};
