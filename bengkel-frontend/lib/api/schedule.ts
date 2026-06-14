import api from "./axios";
import { ApiResponse, ShopConfig, ShopClosure } from "../types";

// Public
export async function getShopConfig(): Promise<ShopConfig> {
  const res = await api.get<ApiResponse<ShopConfig>>("/book/config");
  return res.data.data;
}

// Admin
export async function updateShopConfig(data: {
  open_days: number[];
  open_time: string;
  close_time: string;
  max_bookings_per_day: number;
}): Promise<ShopConfig> {
  const res = await api.put<ApiResponse<ShopConfig>>("/admin/book/config", data);
  return res.data.data;
}

export async function getClosures(): Promise<ShopClosure[]> {
  const res = await api.get<ApiResponse<ShopClosure[]>>("/admin/book/closures");
  return res.data.data;
}

export async function createClosure(data: {
  date: string;
  is_closed: boolean;
  note?: string;
}): Promise<ShopClosure> {
  const res = await api.post<ApiResponse<ShopClosure>>("/admin/book/closures", data);
  return res.data.data;
}

export async function createClosureBulk(data: {
  dates: string[];
  is_closed: boolean;
  note?: string;
}): Promise<ShopClosure[]> {
  const res = await api.post<ApiResponse<ShopClosure[]>>(
    "/admin/book/closures/bulk",
    data
  );
  return res.data.data;
}

export async function createClosureRange(data: {
  date_from: string;
  date_to: string;
  is_closed: boolean;
  note?: string;
}): Promise<void> {
  await api.post("/admin/book/closures/range", data);
}

export async function updateClosure(
  id: string,
  data: {
    is_closed: boolean;
    is_overridden?: boolean;
    note?: string;
  }
): Promise<ShopClosure> {
  const res = await api.patch<ApiResponse<ShopClosure>>(
    `/admin/book/closures/${id}`,
    data
  );
  return res.data.data;
}

export async function deleteClosure(id: string): Promise<void> {
  await api.delete(`/admin/book/closures/${id}`);
}

export async function syncNationalHolidays(year?: number): Promise<void> {
  await api.post(`/admin/book/sync-holidays`, null, {
    params: { year: year || new Date().getFullYear() },
  });
}