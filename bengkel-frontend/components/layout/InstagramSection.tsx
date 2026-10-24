"use client";

import Script from "next/script";
import { useWidgetStatus } from "@/lib/hooks/useWidgetStatus";

const INSTAGRAM_URL = "https://www.instagram.com/cipendawamotor.id/";

export default function InstagramSection() {
  const { containerRef, status, reportError } = useWidgetStatus(
    '.es-media-image, a[href*="instagram.com/p/"] img, a[href*="instagram.com/reel/"] img, .eapps-instagram-feed-posts-item-image, [class*="MediaImage"] img, video, iframe[src*="instagram.com"], iframe[src*="elfsight"]',
  );

  return (
    <section id="instagram" aria-labelledby="instagram-heading" className="scroll-mt-24 bg-navy py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="instagram-heading" className="mb-8 text-3xl font-bold text-white sm:text-4xl">
          Instagram Cipendawa Motor
        </h2>
        <div className="rounded-lg bg-white p-4 text-navy sm:p-6">
          <div
            ref={containerRef}
            className="elfsight-app-20629220-dcc2-4ddb-9846-817bfe7e1f51 min-h-48"
            data-elfsight-app-lazy
          />
        </div>
        {status === "loading" && (
          <p role="status" className="mt-4 text-sm text-white/85">
            Memuat unggahan Instagram…
          </p>
        )}
        {status === "unavailable" && (
          <p role="status" className="mt-4 text-white/85">
            Unggahan tidak dapat dimuat. Anda tetap bisa melihatnya di Instagram.
          </p>
        )}
        <noscript>
          <p className="mt-4 text-white/85">Lihat unggahan langsung di Instagram.</p>
        </noscript>
        <p className="mt-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline underline-offset-4 hover:text-white/85"
          >
            Buka Instagram @cipendawamotor.id
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
