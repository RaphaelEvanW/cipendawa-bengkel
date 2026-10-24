import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cipendawa Motor | Spesialis Body Repair Sejak 1976",
  description:
    "Cipendawa Motor, spesialis body repair sejak 1976. Layanan servis, suku cadang, dan variasi mobil di tiga cabang di Cianjur dan Sukabumi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
