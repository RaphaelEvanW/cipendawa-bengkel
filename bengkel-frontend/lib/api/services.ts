import api from "./axios";
import { ApiResponse, Service } from "../types";

// Public
export async function getServices(): Promise<Service[]> {
  const res = await api.get<ApiResponse<Service[]>>("/services");
  return res.data.data;
}

export async function getServiceById(id: string): Promise<Service> {
  const res = await api.get<ApiResponse<Service>>(`/services/${id}`);
  return res.data.data;
}

// Admin
export async function getServicesAdmin(): Promise<Service[]> {
  const res = await api.get<ApiResponse<Service[]>>("/admin/services");
  return res.data.data;
}

export async function createService(data: {
  name: string;
  description: string;
  price_estimate: number;
  duration_minutes: number;
  category: string;
}): Promise<Service> {
  const res = await api.post<ApiResponse<Service>>("/admin/services", data);
  return res.data.data;
}

export async function updateService(
  id: string,
  data: {
    name: string;
    description: string;
    price_estimate: number;
    duration_minutes: number;
    category: string;
    is_active: boolean;
  }
): Promise<Service> {
  const res = await api.put<ApiResponse<Service>>(`/admin/services/${id}`, data);
  return res.data.data;
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/admin/services/${id}`);
}