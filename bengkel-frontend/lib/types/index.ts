// ============================================
// AUTH
// ============================================
export type Admin = {
  id: string;
  username: string;
  email: string;
  created_at: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  admin: Admin;
};

// ============================================
// SERVICE
// ============================================
export type Service = {
  id: string;
  name: string;
  description: string;
  price_estimate: number;
  duration_minutes: number;
  category: string;
  is_active: boolean;
  created_at: string;
};

// ============================================
// SHOP CONFIG & CLOSURES
// ============================================
export type ShopConfig = {
  id: string;
  open_days: number[];
  open_time: string;
  close_time: string;
  max_bookings_per_day: number;
  updated_at: string;
};

export type ShopClosure = {
  id: string;
  date: string;
  is_national_holiday: boolean;
  is_overridden: boolean;
  is_closed: boolean;
  note: string;
};

export type AvailabilityResponse = {
  available: boolean;
  reason?: string;
  current_bookings: number;
  max_bookings: number;
};

// ============================================
// RESERVATION
// ============================================
export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "done"
  | "rejected"
  | "cancelled";

export type Reservation = {
  id: string;
  booking_code: string;
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
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
};

export type ReservationLog = {
  id: string;
  reservation_id: string;
  admin_id: string;
  old_status: string;
  new_status: string;
  note: string;
  changed_at: string;
};

// ============================================
// NOTIFICATION
// ============================================
export type NotificationChannel = "whatsapp" | "email";
export type NotificationStatus = "pending" | "sent" | "failed";

export type Notification = {
  id: string;
  reservation_id: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  payload: string;
  sent_at?: string;
};

// ============================================
// DASHBOARD
// ============================================
export type DashboardSummary = {
  today_total: number;
  pending: number;
  confirmed: number;
  in_progress: number;
  done: number;
  rejected: number;
  cancelled: number;
};

export type ChartPoint = {
  date: string;
  total: number;
};

// ============================================
// SETTINGS
// ============================================
export type Setting = {
  key: string;
  value: string;
  updated_at: string;
};

// ============================================
// API RESPONSE WRAPPER
// ============================================
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};