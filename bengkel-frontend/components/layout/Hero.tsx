import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-navy"
      style={{
        backgroundImage: "url('/photos/1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #bcff61 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Left dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/50 to-transparent" />

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="max-w-2xl">
          {/* Since 1976 label */}
          <p className="text-lime text-xs font-bold uppercase tracking-[0.2em] mb-6">
            — Spesialis Bengkel Mobil Sejak 1976
          </p>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 uppercase">
            Bengkel<br />
            Terpercaya<br />
            <span className="text-lime">Cianjur.</span>
          </h1>

          {/* Description */}
          <p className="text-base text-white/55 leading-relaxed mb-10 max-w-md">
            Body repair, service, sparepart, dan variasi mobil.
            Lebih dari 48 tahun melayani puluhan ribu pelanggan
            di Cianjur dan Sukabumi.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/reservasi"
              className="inline-flex items-center gap-2 bg-lime text-navy font-black px-8 py-4 text-sm uppercase tracking-wider hover:bg-lime-dark transition-colors"
              style={{ borderRadius: 0 }}
            >
              Reservasi Bengkel Sekarang →
            </Link>
            <Link
              href="/cek-status"
              className="inline-flex items-center gap-2 bg-transparent text-white font-bold px-8 py-4 text-sm uppercase tracking-wider hover:bg-white/10 transition-colors border border-white/30"
              style={{ borderRadius: 0 }}
            >
              Hubungi Kami
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10 mt-14 pt-10 border-t border-white/10">
            {[
              { value: "48+", label: "Tahun Pengalaman" },
              { value: "3", label: "Cabang" },
              { value: "10rb+", label: "Pelanggan" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-lime leading-none">{stat.value}</p>
                <p className="text-xs text-white/40 uppercase tracking-widest mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical text decoration */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
        <div className="w-px h-16 bg-white/10" />
        <p
          className="text-white/15 text-xs uppercase tracking-[0.3em] font-bold"
          style={{ writingMode: "vertical-rl" }}
        >
          Cipendawa Motor — Est. 1976
        </p>
        <div className="w-px h-16 bg-white/10" />
      </div>
    </section>
  );
}