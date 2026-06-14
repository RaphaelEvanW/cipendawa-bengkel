import api from "./axios";
import { ApiResponse, DashboardSummary, ChartPoint } from "../types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await api.get<ApiResponse<DashboardSummary>>(
    "/admin/dashboard/summary"
  );
  return res.data.data;
}

export async function getChartData(): Promise<ChartPoint[]> {
  const res = await api.get<ApiResponse<ChartPoint[]>>("/admin/dashboard/chart");
  return res.data.data;
}