import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cipendawa Motor — Spesialis Body Repair Sejak 1976",
  description:
    "Bengkel spesialis body repair, service, sparepart, dan variasi mobil terpercaya di Cianjur dan Sukabumi sejak 1976.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}