import type { Metadata } from "next";
import ReservationFlow from "@/components/reservation/ReservationFlow";
import { isReservationDemo } from "@/lib/reservation-mode";

export const metadata: Metadata = {
  title: "Reservasi | Cipendawa Motor",
  description: "Pilih layanan, cabang, dan jadwal kunjungan ke Cipendawa Motor. Jadwal reservasi perlu dikonfirmasi oleh tim bengkel.",
  robots: { index: false, follow: true },
};

export default function ReservationPage() {
  return <ReservationFlow demoMode={isReservationDemo()} />;
}
