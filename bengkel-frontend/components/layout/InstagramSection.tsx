"use client";

import Script from "next/script";
import { useWidgetStatus } from "@/lib/hooks/useWidgetStatus";

const INSTAGRAM_URL = "https://www.instagram.com/cipendawamotor.id/";

export default function InstagramSection() {
  const { containerRef, status, reportError } = useWidgetStatus(
    'a[href*="instagram.com/p/"] img, a[href*="instagram.com/reel/"] img, video, iframe[src*="instagram.com"], iframe[src*="zyff.app"]',
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
            className="zyff-instagram min-h-48"
            data-zyff-widget="instagram"
            data-zyff-id="lbwI2zYe3hkE2g"
          />
        </div>
        {status === "loading" && (
          <p role="status" className="mt-4 text-sm text-white/85">
            Memuat feed Instagram…
          </p>
        )}
        {status === "unavailable" && (
          <p role="status" className="mt-4 text-white/85">
            Feed belum tampil. Lihat unggahan melalui tautan Instagram di bawah.
          </p>
        )}
        <noscript>
          <p className="mt-4 text-white/85">Lihat unggahan melalui tautan Instagram di bawah.</p>
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
          src="https://www.zyff.app/w/instagram.js"
          strategy="afterInteractive"
          onError={reportError}
        />
      </div>
    </section>
  );
}
