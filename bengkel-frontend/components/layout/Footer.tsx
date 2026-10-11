import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";

const branches = [
  {
    name: "Cipendawa Utama",
    address:
      "Jl. Raya Bandung, Cibuarial Km, RT.02-03/RW.No.28, Sabandar, Kec. Karangtengah, Kab. Cianjur, Jawa Barat 43281",
    mapsUrl:
      "https://maps.google.com/?q=Jl.+Raya+Bandung+Cibuarial+Sabandar+Karangtengah+Cianjur",
  },
  {
    name: "Cipendawa Cianjur 2",
    address:
      "Jl. Raya Sukabumi, Terusan Jl. Siliwangi No.77d, Sukamaju, Kec. Cianjur, Kab. Cianjur, Jawa Barat 43215",
    mapsUrl:
      "https://maps.google.com/?q=Jl.+Raya+Sukabumi+Siliwangi+No.77d+Cianjur",
  },
  {
    name: "Cipendawa Sukabumi",
    address:
      "Jl. Pelabuhan II No.272A, Dayeuhluhur, Kec. Warudoyong, Kota Sukabumi, Jawa Barat 43134",
    mapsUrl:
      "https://maps.google.com/?q=Jl.+Pelabuhan+II+No.272A+Dayeuhluhur+Warudoyong+Sukabumi",
  },
];

const contacts = [
  { label: "Service", number: "6287881285526" },
  { label: "Body Repair", number: "6287770350243" },
  { label: "Sparepart", number: "6287770350306" },
];

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Layanan & Harga" },
  { href: "/reservasi", label: "Reservasi" },
  { href: "/cek-status", label: "Cek Status Reservasi" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-light border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <span className="text-xl font-bold text-white">
              Cipendawa<span className="text-lime">Motor</span>
            </span>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Spesialis Body Repair, Service, Sparepart & Variasi Mobil sejak
              1976. Dipercaya puluhan ribu pelanggan di Cianjur dan Sukabumi.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
              <Clock size={14} className="text-lime" />
              <span>Senin - Sabtu, 08.00 - 17.00 WIB</span>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-white mb-4">
              Lokasi Cabang
            </h3>
            <div className="flex flex-col gap-4">
              {branches.map((branch) => (
                <a
                  key={branch.name}
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group"
                >
                  <MapPin
                    size={14}
                    className="text-lime mt-0.5 shrink-0 group-hover:text-lime-dark"
                  />
                  <div>
                    <p className="text-sm font-medium text-white/80 group-hover:text-lime transition-colors">
                      {branch.name}
                    </p>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {branch.address}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Hubungi Kami
            </h3>
            <div className="flex flex-col gap-3">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={"https://wa.me/" + c.number}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <Phone
                    size={14}
                    className="text-lime group-hover:text-lime-dark"
                  />
                  <div>
                    <p className="text-xs text-white/50">{c.label}</p>
                    <p className="text-sm text-white/80 group-hover:text-lime transition-colors">
                      +{c.number}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Navigasi</h3>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-lime transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            {new Date().getFullYear()} Cipendawa Motor. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Spesialis Body Repair Sejak 1976
          </p>
        </div>
      </div>
    </footer>
  );
}
