import type { Metadata } from "next";
import ReservationFlow from "@/components/reservation/ReservationFlow";

export const metadata: Metadata = {
  title: "Reservasi | Cipendawa Motor",
  description: "Rencanakan layanan, cabang, dan waktu kunjungan Anda ke Cipendawa Motor.",
  robots: { index: false, follow: true },
};

export default function ReservationPage() {
  return <ReservationFlow />;
}
