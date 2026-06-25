import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 via-navy to-navy-light" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-lime/5 to-transparent" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-lime/10 border border-lime/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            <span className="text-lime text-sm font-medium">
              Spesialis Body Repair Sejak 1976
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Bengkel Terpercaya{" "}
            <span className="text-lime">Generasi ke Generasi</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-xl">
            Lebih dari 48 tahun melayani kebutuhan body repair, service,
            sparepart, dan variasi mobil Anda. Dipercaya puluhan ribu pelanggan
            di Cianjur dan Sukabumi.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/reservasi"
              className="inline-flex items-center gap-2 bg-lime text-navy font-bold px-8 py-4 rounded-xl text-base hover:bg-lime-dark transition-all hover:scale-105"
            >
              Booking Sekarang →
            </Link>
            <Link
              href="/cek-status"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/20 transition-all border border-white/10"
            >
              Cek Status Reservasi
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-12 border-t border-white/10">
            {[
              { value: "48+", label: "Tahun Pengalaman" },
              { value: "3", label: "Cabang" },
              { value: "10rb+", label: "Pelanggan" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-lime">{stat.value}</p>
                <p className="text-sm text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}