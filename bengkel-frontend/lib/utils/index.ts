import { ReservationStatus } from "../types";

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}

export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function formatTime(timeStr: string): string {
  // handle format HH:MM:SS dari DB
  return timeStr.slice(0, 5);
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  in_progress: "Sedang Dikerjakan",
  done: "Selesai",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
};

export const STATUS_COLOR: Record<ReservationStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  done: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export function getDayName(dayIndex: number): string {
  return DAY_NAMES[dayIndex] || "";
}

export function generateTimeSlots(
  openTime: string,
  closeTime: string,
  intervalMinutes: number = 60
): string[] {
  const slots: string[] = [];
  const [openHour, openMin] = openTime.split(":").map(Number);
  const [closeHour, closeMin] = closeTime.split(":").map(Number);

  let current = openHour * 60 + openMin;
  const end = closeHour * 60 + closeMin;

  while (current <= end) {
    const h = Math.floor(current / 60).toString().padStart(2, "0");
    const m = (current % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
    current += intervalMinutes;
  }

  return slots;
}