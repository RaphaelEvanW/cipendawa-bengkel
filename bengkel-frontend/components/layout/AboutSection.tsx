import { CheckCircle } from "lucide-react";

const highlights = [
  "Spesialis body repair terpercaya sejak 1976",
  "Melayani semua jenis kendaraan roda empat",
  "Menggunakan cat dan bahan berkualitas tinggi",
  "Teknisi bersertifikat dan berpengalaman",
  "Sparepart original dan bergaransi",
  "Estimasi biaya transparan tanpa biaya tersembunyi",
];

export default function AboutSection() {
  return (
    <section className="py-20 bg-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] bg-navy rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
              <p className="text-white/20 text-sm">Foto Bengkel</p>
            </div>
            {/* Badge */}
            <div className="absolute -bottom-6 -right-6 bg-lime rounded-2xl p-5 shadow-xl">
              <p className="text-navy font-bold text-4xl leading-none">48+</p>
              <p className="text-navy/70 text-sm font-medium mt-1">
                Tahun Pengalaman
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-lime text-sm font-semibold uppercase tracking-widest">
              Tentang Kami
            </span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">
              Bengkel Terpercaya Keluarga Cianjur
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Cipendawa Motor berdiri sejak tahun 1976 sebagai bengkel spesialis
              body repair di Cianjur. Selama hampir lima dekade, kami telah
              berkembang menjadi bengkel lengkap yang melayani service, sparepart,
              dan variasi kendaraan.
            </p>
            <p className="text-white/60 leading-relaxed mb-8">
              Dengan 3 cabang yang tersebar di Cianjur dan Sukabumi, kami
              berkomitmen untuk memberikan pelayanan terbaik dengan standar
              kualitas yang konsisten di setiap cabang.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="text-lime mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}