import { MapPin, Phone, Clock } from "lucide-react";

const branches = [
  {
    name: "Cipendawa Utama",
    address:
      "Jl. Raya Bandung, Cibuarial Km, RT.02-03/RW.No.28, Sabandar, Kec. Karangtengah, Kab. Cianjur, Jawa Barat 43281",
    mapsUrl:
      "https://maps.google.com/?q=Jl.+Raya+Bandung+Cibuarial+Sabandar+Karangtengah+Cianjur",
    mapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.0!2d107.14!3d-6.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDknMTIuMCJTIDEwN8KwMDgnMjQuMCJF!5e0!3m2!1sid!2sid!4v1234567890",
  },
  {
    name: "Cipendawa Cianjur 2",
    address:
      "Jl. Raya Sukabumi, Terusan Jl. Siliwangi No.77d, Sukamaju, Kec. Cianjur, Kab. Cianjur, Jawa Barat 43215",
    mapsUrl:
      "https://maps.google.com/?q=Jl.+Raya+Sukabumi+Siliwangi+No.77d+Cianjur",
    mapsEmbed: "",
  },
  {
    name: "Cipendawa Sukabumi",
    address:
      "Jl. Pelabuhan II No.272A, Dayeuhluhur, Kec. Warudoyong, Kota Sukabumi, Jawa Barat 43134",
    mapsUrl:
      "https://maps.google.com/?q=Jl.+Pelabuhan+II+No.272A+Dayeuhluhur+Warudoyong+Sukabumi",
    mapsEmbed: "",
  },
];

const contacts = [
  { label: "Service", number: "6287881285526" },
  { label: "Body Repair", number: "6287770350243" },
  { label: "Sparepart", number: "6287770350306" },
];

export default function LocationSection() {
  return (
    <section className="py-20 bg-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-lime text-sm font-semibold uppercase tracking-widest">
            Lokasi
          </span>
          <h2 className="text-4xl font-bold text-white mt-2">
            Temukan Kami di 3 Lokasi
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Hadir di Cianjur dan Sukabumi untuk memudahkan akses pelanggan kami.
          </p>
        </div>

        {/* Branches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {branches.map((branch) => (
            <div
              key={branch.name}
              className="bg-navy border border-white/10 rounded-xl p-6 hover:border-lime/30 transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center text-lime shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{branch.name}</h3>
                  <p className="text-white/50 text-sm mt-1 leading-relaxed">
                    {branch.address}
                  </p>
                </div>
              </div>
              
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lime text-sm font-medium hover:underline"
              >
                Buka di Google Maps →
              </a>
            </div>
          ))}
        </div>

        {/* Info row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Jam operasional */}
          <div className="bg-navy border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center text-lime">
                <Clock size={18} />
              </div>
              <h3 className="text-white font-semibold">Jam Operasional</h3>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Senin – Jumat</span>
                <span className="text-white">08.00 – 17.00 WIB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Sabtu</span>
                <span className="text-white">08.00 – 15.00 WIB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Minggu</span>
                <span className="text-red-400">Tutup</span>
              </div>
            </div>
          </div>

          {/* Kontak */}
          <div className="bg-navy border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center text-lime">
                <Phone size={18} />
              </div>
              <h3 className="text-white font-semibold">Hubungi Kami</h3>
            </div>
            <div className="flex flex-col gap-3">
              {contacts.map((c) => (
                
                    key={c.label}
                    href={`https://wa.me/${c.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group"
                >
                    <span className="text-sm text-white/60">{c.label}</span>
                    <span className="text-sm text-lime group-hover:underline">
                    +{c.number}
                    </span>
                </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}