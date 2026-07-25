import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-brand-blue via-brand-blue/80 to-navy-light rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 bg-lime/20 border border-lime/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span className="text-lime text-sm font-medium">
                Reservasi Online Tersedia
              </span>
            </span>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Siap Servis Kendaraan Anda?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Booking sekarang dan tim kami siap melayani kendaraan Anda dengan
              standar kualitas terbaik.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/reservasi"
                className="inline-flex items-center gap-2 bg-lime text-navy font-bold px-8 py-4 rounded-xl text-base hover:bg-lime-dark transition-all hover:scale-105"
              >
                Booking Sekarang →
              </Link>
              <Link
                href="/cek-status"
                className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/20 transition-all border border-white/20"
              >
                Cek Status Reservasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}