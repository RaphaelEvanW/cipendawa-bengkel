export function isReservationDemo() {
  const mode = process.env.RESERVATION_MODE;
  if (mode) return mode === "demo";
  return !process.env.BACKEND_API_URL?.trim();
}
