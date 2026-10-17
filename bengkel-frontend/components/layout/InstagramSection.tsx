"use client";

import Script from "next/script";
import { useState } from "react";

export default function InstagramSection() {
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <section id="instagram" aria-labelledby="instagram-heading" className="scroll-mt-24 bg-navy py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="instagram-heading" className="mb-8 text-3xl font-bold text-white sm:text-4xl">
          Instagram Cipendawa Motor
        </h2>
        <div className="rounded-lg bg-white p-4 text-navy sm:p-6">
          <div
            className="zyff-instagram min-h-48"
            data-zyff-widget="instagram"
            data-zyff-id="lbwI2zYe3hkE2g"
          />
        </div>
        {loadFailed && (
          <p role="status" className="mt-4 text-white/70">
            Feed Instagram belum dapat dimuat. Silakan muat ulang halaman.
          </p>
        )}
        <noscript>
          <p className="text-white/70">Aktifkan JavaScript untuk melihat feed Instagram.</p>
        </noscript>
        <Script
          src="https://www.zyff.app/w/instagram.js"
          strategy="afterInteractive"
          onError={() => setLoadFailed(true)}
        />
      </div>
    </section>
  );
}
