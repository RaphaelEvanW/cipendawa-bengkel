"use client";

import Script from "next/script";
import { useWidgetStatus } from "@/lib/hooks/useWidgetStatus";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Cipendawa+Motor+Cianjur";

export default function TestimonialSection() {
  const { containerRef, status, reportError } = useWidgetStatus(
    '.eapps-google-reviews-review-text, [class*="ReviewText"], [class*="ReviewContent"], iframe[src*="elfsight"]',
  );

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
            ref={containerRef}
            className="elfsight-app-2bb9cb75-042f-4397-aaf8-042019b45792 min-h-72"
            data-elfsight-app-lazy
          />
        </div>
        {status === "loading" && (
          <p role="status" className="mt-4 text-center text-sm text-white/85">
            Memuat ulasan Google…
          </p>
        )}
        {status === "unavailable" && (
          <p role="status" className="mt-4 text-center text-white/85">
            Ulasan belum tampil. Buka Google Maps melalui tautan di bawah.
          </p>
        )}
        <noscript>
          <p className="mt-4 text-center text-white/85">
            Lihat ulasan melalui tautan Google Maps di bawah.
          </p>
        </noscript>
        <p className="mt-4 text-center">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline underline-offset-4 hover:text-white/85"
          >
            Buka di Google Maps
          </a>
        </p>
        <Script
          src="https://elfsightcdn.com/platform.js"
          strategy="afterInteractive"
          onError={reportError}
        />
      </div>
    </section>
  );
}
