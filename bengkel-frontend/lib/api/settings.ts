import api from "./axios";
import { ApiResponse, Setting } from "../types";

export async function getSettings(): Promise<Setting[]> {
  const res = await api.get<ApiResponse<Setting[]>>("/admin/settings");
  return res.data.data;
}

export async function getSetting(key: string): Promise<Setting> {
  const res = await api.get<ApiResponse<Setting>>(`/admin/settings/${key}`);
  return res.data.data;
}

export async function updateSetting(
  key: string,
  value: string
): Promise<Setting> {
  const res = await api.put<ApiResponse<Setting>>(`/admin/settings/${key}`, {
    value,
  });
  return res.data.data;
}