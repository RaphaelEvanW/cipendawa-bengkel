import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Budi Santoso",
    vehicle: "Toyota Avanza",
    rating: 5,
    review:
      "Hasil body repair mobil saya luar biasa, seperti baru lagi. Teknisinya sangat profesional dan pengerjaan tepat waktu. Sudah langganan di sini lebih dari 10 tahun.",
  },
  {
    name: "Siti Rahayu",
    vehicle: "Honda Jazz",
    rating: 5,
    review:
      "Pelayanan ramah dan harga terjangkau. Cat mobilnya bagus banget, warnanya sangat matching. Puas banget sama hasilnya, recommended!",
  },
  {
    name: "Ahmad Fauzi",
    vehicle: "Daihatsu Xenia",
    rating: 5,
    review:
      "Sudah 3 kali service di sini, selalu memuaskan. Spare part original, harga transparan, dan mekaniknya jujur. Tidak pernah mengecewakan.",
  },
  {
    name: "Dewi Kusuma",
    vehicle: "Suzuki Ertiga",
    rating: 5,
    review:
      "Body repair setelah kecelakaan, hasilnya sempurna. Tidak kelihatan sama sekali bekas tabrakannya. Terima kasih Cipendawa Motor!",
  },
  {
    name: "Rudi Hermawan",
    vehicle: "Mitsubishi Pajero",
    rating: 5,
    review:
      "Variasi mobilnya bagus-bagus pilihannya. Dipasang dengan rapi dan profesional. Harga sesuai kualitas. Sangat merekomendasikan bengkel ini.",
  },
  {
    name: "Ani Wijaya",
    vehicle: "Toyota Innova",
    rating: 5,
    review:
      "Sudah turun-temurun servis di sini dari zaman orang tua. Kualitas tidak pernah menurun, selalu konsisten. Bengkel paling terpercaya di Cianjur.",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-lime text-sm font-semibold uppercase tracking-widest">
            Testimoni
          </span>
          <h2 className="text-4xl font-bold text-white mt-2">
            Apa Kata Pelanggan Kami
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Kepercayaan pelanggan adalah prioritas utama kami selama hampir 5
            dekade melayani masyarakat Cianjur dan Sukabumi.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-navy-light border border-white/10 rounded-xl p-6 hover:border-lime/20 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-lime fill-lime"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                "{t.review}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-lime/20 flex items-center justify-center text-lime font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.vehicle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}