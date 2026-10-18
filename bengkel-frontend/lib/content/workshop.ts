export const workshopContacts = [
  { id: "service", label: "Service", number: "6287881285526" },
  { id: "body_repair", label: "Body Repair", number: "6287770350243" },
  { id: "sparepart", label: "Sparepart & Variasi", number: "6287770350306" },
] as const;

export const workshopHours = {
  days: "Senin - Sabtu",
  time: "08.00 - 17.00 WIB",
  closedDay: "Minggu",
} as const;

export const publicNavLinks = [
  { href: "/#beranda", label: "Beranda" },
  { href: "/#layanan", label: "Layanan" },
  { href: "/reservasi", label: "Reservasi" },
  { href: "/#lokasi", label: "Lokasi" },
] as const;
