"use client";

import Script from "next/script";
import { useState } from "react";

export default function TestimonialSection() {
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <section id="ulasan" aria-labelledby="ulasan-heading" className="scroll-mt-24 bg-navy py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 id="ulasan-heading" className="text-3xl font-bold text-white sm:text-4xl">
            Apa Kata Pelanggan Kami
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-white/85">
            Pengalaman pelanggan Cipendawa Motor melalui ulasan Google.
          </p>
        </div>
        <div>
          <div
            className="elfsight-app-2bb9cb75-042f-4397-aaf8-042019b45792 min-h-72"
            data-elfsight-app-lazy
          />
        </div>
        {loadFailed && (
          <p role="status" className="mt-4 text-center text-white/85">
            Ulasan Google belum dapat dimuat. Silakan muat ulang halaman.
          </p>
        )}
        <noscript>
          <p className="mt-4 text-center text-white/85">
            Aktifkan JavaScript untuk melihat ulasan Google.
          </p>
        </noscript>
        <Script
          src="https://elfsightcdn.com/platform.js"
          strategy="afterInteractive"
          onError={() => setLoadFailed(true)}
        />
      </div>
    </section>
  );
}
