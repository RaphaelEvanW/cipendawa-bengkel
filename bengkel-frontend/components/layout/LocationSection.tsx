import { MapPin, Clock } from "lucide-react";
import { workshopHours } from "@/lib/content/workshop";

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

export default function LocationSection() {
  return (
    <section id="lokasi" aria-labelledby="lokasi-heading" className="scroll-mt-24 py-14 sm:py-20 bg-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="lokasi-heading" className="text-3xl sm:text-4xl font-bold text-lime">
            Temukan kami di 3 lokasi
          </h2>
          <p className="text-white/85 mt-3 max-w-xl mx-auto">
            Pilih cabang di Cianjur atau Sukabumi yang ingin Anda kunjungi.
          </p>
        </div>

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
                  <p className="text-white/85 text-sm mt-1 leading-relaxed">
                    {branch.address}
                  </p>
                </div>
              </div>
              <a
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 py-2 text-lime text-sm font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
              >
                Buka di Google Maps
              </a>
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto">
          <div className="bg-navy border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center text-lime">
                <Clock size={18} />
              </div>
              <h3 className="text-white font-semibold">Jam operasional</h3>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
                <span className="text-white/85">{workshopHours.days}</span>
                <span className="text-white">{workshopHours.time}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
                <span className="text-white/85">{workshopHours.closedDay}</span>
                <span className="text-red-400">Tutup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
