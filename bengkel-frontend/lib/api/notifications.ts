import api from "./axios";
import { ApiResponse, Notification } from "../types";

export async function getNotifications(): Promise<Notification[]> {
  const res = await api.get<ApiResponse<Notification[]>>("/admin/notifications");
  return res.data.data;
}

export async function getNotificationsByReservation(
  reservationId: string
): Promise<Notification[]> {
  const res = await api.get<ApiResponse<Notification[]>>(
    `/admin/notifications/reservation/${reservationId}`
  );
  return res.data.data;
}

export async function retryNotification(id: string): Promise<void> {
  await api.post(`/admin/notifications/${id}/retry`);
}