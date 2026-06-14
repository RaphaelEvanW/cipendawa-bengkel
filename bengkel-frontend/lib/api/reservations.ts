import api from "./axios";
import { ApiResponse, Reservation, ReservationLog, AvailabilityResponse } from "../types";

// Public
export async function checkAvailability(date: string, time: string): Promise<AvailabilityResponse> {
  const res = await api.post<ApiResponse<AvailabilityResponse>>("/book/availability", {
    date,
    time,
  });
  return res.data.data;
}

export async function createReservation(data: {
  service_id: string;
  reservation_date: string;
  reservation_time: string;
  customer_name: string;
  customer_phone: string;
  customer_vehicle: string;
  notes?: string;
  reschedule_willing: boolean;
  reschedule_date_from?: string;
  reschedule_date_to?: string;
  reschedule_time_from?: string;
  reschedule_time_to?: string;
}): Promise<Reservation> {
  const res = await api.post<ApiResponse<Reservation>>("/reservations", data);
  return res.data.data;
}

export async function checkReservationStatus(params: {
  booking_code?: string;
  customer_phone?: string;
}): Promise<Reservation | Reservation[]> {
  const res = await api.post<ApiResponse<Reservation | Reservation[]>>(
    "/reservations/status",
    params
  );
  return res.data.data;
}

// Admin
export async function getReservations(params?: {
  status?: string;
  date?: string;
}): Promise<Reservation[]> {
  const res = await api.get<ApiResponse<Reservation[]>>("/admin/reservations", {
    params,
  });
  return res.data.data;
}

export async function getReservationById(id: string): Promise<Reservation> {
  const res = await api.get<ApiResponse<Reservation>>(`/admin/reservations/${id}`);
  return res.data.data;
}

export async function updateReservationStatus(
  id: string,
  data: { status: string; note?: string }
): Promise<void> {
  await api.patch(`/admin/reservations/${id}/status`, data);
}

export async function deleteReservation(id: string): Promise<void> {
  await api.delete(`/admin/reservations/${id}`);
}

export async function getReservationLogs(id: string): Promise<ReservationLog[]> {
  const res = await api.get<ApiResponse<ReservationLog[]>>(
    `/admin/reservations/${id}/logs`
  );
  return res.data.data;
}