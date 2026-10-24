"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const highlights = [
  "Spesialis body repair sejak 1976",
  "Melayani semua jenis kendaraan roda empat",
  "Cat dan bahan berkualitas",
  "Teknisi bersertifikat dan berpengalaman",
  "Suku cadang asli dan bergaransi",
  "Rincian estimasi biaya tanpa biaya tersembunyi",
];

const pairs = [
  { before: "/images/before_after/Body_repair/repair_before.jpg", after: "/images/before_after/Body_repair/repair_after.jpg", label: "Body Repair" },
  { before: "/images/before_after/Repaint/before_repaint.jpg", after: "/images/before_after/Repaint/after_repaint.jpg", label: "Cat Ulang" },
  { before: "/images/before_after/Dent/dent_before.jpg", after: "/images/before_after/Dent/dent_after.jpg", label: "Dent Removal" },
];

function BeforeAfterSlider({ before, after, label }: { before: string; after: string; label: string }) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseUp = () => setDragging(false);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragging) updatePosition(e.clientX);
  }, [dragging, updatePosition]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove]);

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label={`Perbandingan sebelum dan sesudah ${label}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-orientation="horizontal"
      aria-valuenow={Math.round(position)}
      aria-valuetext={`${Math.round(position)} persen foto sebelum ditampilkan`}
      className="relative w-full h-full overflow-hidden cursor-col-resize select-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lime"
      onMouseDown={(event) => {
        setDragging(true);
        updatePosition(event.clientX);
      }}
      onTouchStart={(event) => updatePosition(event.touches[0].clientX)}
      onTouchMove={(e) => onTouchMove(e.nativeEvent)}
      onKeyDown={(event) => {
        const changes: Record<string, number> = {
          ArrowLeft: -5,
          ArrowDown: -5,
          ArrowRight: 5,
          ArrowUp: 5,
          PageDown: -10,
          PageUp: 10,
        };

        if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          setPosition(event.key === "Home" ? 0 : 100);
        } else if (event.key in changes) {
          event.preventDefault();
          setPosition((current) => Math.max(0, Math.min(100, current + changes[event.key])));
        }
      }}
    >
      {/* After image (full) */}
      <div className="absolute inset-0">
        <Image
          src={after}
          alt={`Mobil sesudah ${label}`}
          fill
          sizes="(min-width: 1024px) 480px, (min-width: 640px) 80vw, 75vw"
          draggable={false}
          className="object-contain"
        />
        <div className="absolute top-3 right-3 bg-lime text-navy text-xs font-black px-2 py-1 uppercase tracking-wider">
          Sesudah
        </div>
      </div>

      {/* Clip the full frame so both photos keep the same scale while dragging. */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before}
          alt={`Mobil sebelum ${label}`}
          fill
          sizes="(min-width: 1024px) 480px, (min-width: 640px) 80vw, 75vw"
          draggable={false}
          className="object-contain"
        />
        <div className="absolute top-3 left-3 bg-navy text-white text-xs font-black px-2 py-1 uppercase tracking-wider">
          Sebelum
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="flex gap-0.5">
            <ChevronLeft size={10} className="text-navy" />
            <ChevronRight size={10} className="text-navy" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const [currentPair, setCurrentPair] = useState(0);

  const prev = () => setCurrentPair((p) => (p === 0 ? pairs.length - 1 : p - 1));
  const next = () => setCurrentPair((p) => (p === pairs.length - 1 ? 0 : p + 1));

  return (
    <section id="hasil-pekerjaan" aria-labelledby="about-heading" className="scroll-mt-24 py-20 bg-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="relative">

            {/* Slider + prev/next sejajar */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Lihat perbandingan sebelumnya"
                onClick={prev}
                className="flex items-center justify-center w-11 h-11 shrink-0 border border-white/20 text-white hover:bg-white/10 transition-colors"
                style={{ borderRadius: 0 }}
              >
                <ChevronLeft size={16} />
              </button>

              <div className="min-w-0 flex-1 aspect-[4/5] rounded-2xl overflow-hidden bg-navy border border-white/10 ring-2 ring-lime">
                <BeforeAfterSlider
                  key={currentPair}
                  before={pairs[currentPair].before}
                  after={pairs[currentPair].after}
                  label={pairs[currentPair].label}
                />
              </div>

              <button
                type="button"
                aria-label="Lihat perbandingan berikutnya"
                onClick={next}
                className="flex items-center justify-center w-11 h-11 shrink-0 border border-white/20 text-white hover:bg-white/10 transition-colors"
                style={{ borderRadius: 0 }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Dots + label */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <span aria-live="polite" className="text-lime text-xs font-bold uppercase tracking-widest">
                {pairs[currentPair].label}
              </span>
              <div className="flex gap-1.5">
                {pairs.map((pair, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Lihat perbandingan ${pair.label}`}
                    aria-pressed={i === currentPair}
                    onClick={() => setCurrentPair(i)}
                    className="inline-flex h-11 w-11 items-center justify-center"
                  >
                    <span aria-hidden="true" className={`h-1.5 transition-all ${i === currentPair ? "bg-lime w-4" : "bg-white/60 w-1.5"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* 48+ badge */}
            <div
              className="mt-3 inline-block bg-lime p-5"
              style={{ borderRadius: 0 }}
            >
              <p className="text-navy font-black text-4xl leading-none">48+</p>
              <p className="text-navy/70 text-xs font-bold mt-1 uppercase tracking-wider">
                Tahun Pengalaman
              </p>
            </div>
          </div>

          <div>
            <span className="text-lime text-xs font-bold uppercase tracking-[0.2em]">
              Tentang Kami
            </span>
            <h2 id="about-heading" className="text-4xl font-black text-white mt-3 mb-4 uppercase leading-tight">
              Mengenal<br />
              <span className="text-lime">Cipendawa Motor</span>
            </h2>
            <p className="text-white/85 leading-relaxed mb-3 text-sm">
              Cipendawa Motor berdiri pada 1976 sebagai bengkel spesialis
              body repair di Cianjur. Kini, kami juga melayani servis mobil,
              penyediaan suku cadang, dan variasi mobil.
            </p>
            <p className="text-white/85 leading-relaxed mb-8 text-sm">
              Kami melayani pelanggan di tiga cabang di Cianjur dan Sukabumi,
              dengan standar pengerjaan yang sama di setiap cabang.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-lime mt-0.5 shrink-0" />
                  <span className="text-xs text-white/85 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
