import { Shield, Clock, Award, Users, MapPin, Wrench } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Pengalaman lebih dari 48 tahun",
    description:
      "Sejak 1976, kami melayani puluhan ribu pelanggan dan terus memperbaiki standar pengerjaan.",
  },
  {
    icon: Shield,
    title: "Garansi pengerjaan",
    description:
      "Setiap pekerjaan disertai garansi resmi sebagai tanggung jawab kami atas hasil pengerjaan.",
  },
  {
    icon: Wrench,
    title: "Teknisi berpengalaman",
    description:
      "Teknisi kami berpengalaman puluhan tahun menangani body repair, servis, dan variasi mobil.",
  },
  {
    icon: Users,
    title: "Pelayanan ramah",
    description:
      "Pelayanan yang ramah dan profesional, dengan penjelasan terbuka kepada pelanggan.",
  },
  {
    icon: MapPin,
    title: "Tiga cabang",
    description:
      "Pilih cabang di Cianjur atau Sukabumi yang mudah Anda kunjungi.",
  },
  {
    icon: Clock,
    title: "Waktu pengerjaan",
    description:
      "Kami berupaya menyelesaikan pekerjaan sesuai estimasi yang disepakati dengan pelanggan.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-lime text-sm font-semibold uppercase tracking-widest">
            Keunggulan kami
          </span>
          <h2 className="text-4xl font-bold text-white mt-2">
            Mengapa memilih Cipendawa Motor?
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Kenali pengalaman tim, garansi pengerjaan, dan pilihan cabang
            sebelum membawa mobil Anda ke bengkel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-navy-light border border-white/10 rounded-xl p-6 hover:border-lime/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center text-lime mb-4 group-hover:bg-lime group-hover:text-navy transition-colors">
                  <Icon size={22} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
