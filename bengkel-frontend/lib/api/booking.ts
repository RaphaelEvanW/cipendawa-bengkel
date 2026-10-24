export type BookingReceipt = {
  booking_code: string;
  status: "pending";
  notification: { mode: "mock"; status: "simulated"; message: string };
};

export const bookingFields = [
  "service_code", "branch_code", "reservation_date", "preferred_period",
  "customer_name", "customer_phone", "customer_email", "customer_vehicle", "notes",
] as const;

export function isBookingReceipt(value: unknown): value is BookingReceipt {
  if (!value || typeof value !== "object") return false;
  const receipt = value as Partial<BookingReceipt>;
  return typeof receipt.booking_code === "string" && receipt.booking_code.length > 0 && receipt.booking_code.length <= 100
    && receipt.status === "pending" && receipt.notification?.mode === "mock"
    && receipt.notification.status === "simulated" && typeof receipt.notification.message === "string"
    && receipt.notification.message.length <= 8000;
}
