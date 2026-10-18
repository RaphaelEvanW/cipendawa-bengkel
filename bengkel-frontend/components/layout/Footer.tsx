import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock } from "lucide-react";
import { publicNavLinks, workshopContacts, workshopHours } from "@/lib/content/workshop";

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

export default function Footer() {
  return (
    <footer className="bg-navy-light border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime">
              <Image
                src="/logo/cma_white.png"
                alt="Cipendawa Motor"
                width={90}
                height={100}
                className="object-contain"
              />
            </Link>
            <p className="mt-3 text-sm text-white/85 leading-relaxed">
              Spesialis Body Repair, Service, Sparepart & Variasi Mobil sejak
              1976. Dipercaya puluhan ribu pelanggan di Cianjur dan Sukabumi.
            </p>
            <div className="mt-4 flex items-start gap-2 text-sm text-white/85">
              <Clock size={14} aria-hidden="true" className="mt-1 shrink-0 text-lime" />
              <p>
                {workshopHours.days}, {workshopHours.time}
                <span className="block mt-1">{workshopHours.closedDay} tutup</span>
              </p>
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
                  className="flex min-h-11 items-start gap-2 py-1 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                >
                  <MapPin
                    size={14}
                    className="text-lime mt-0.5 shrink-0 group-hover:text-lime-dark"
                  />
                  <div>
                    <p className="text-sm font-medium text-white/85 group-hover:text-lime transition-colors">
                      {branch.name}
                    </p>
                    <p className="text-xs text-white/85 leading-relaxed">
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
              {workshopContacts.map((c) => (
                <a
                  key={c.id}
                  href={"https://wa.me/" + c.number}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-2 py-1 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                >
                  <Phone
                    size={14}
                    className="text-lime group-hover:text-lime-dark"
                  />
                  <div>
                    <p className="text-xs text-white/85">{c.label}</p>
                    <p className="text-sm text-white/85 group-hover:text-lime transition-colors">
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
              {publicNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center py-2 text-sm text-white/85 hover:text-lime transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/85">
            {new Date().getFullYear()} Cipendawa Motor. All rights reserved.
          </p>
          <p className="text-xs text-white/85">
            Spesialis Body Repair Sejak 1976
          </p>
        </div>
      </div>
    </footer>
  );
}
