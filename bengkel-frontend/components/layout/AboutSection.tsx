"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const highlights = [
  "Spesialis body repair terpercaya sejak 1976",
  "Melayani semua jenis kendaraan roda empat",
  "Menggunakan cat dan bahan berkualitas tinggi",
  "Teknisi bersertifikat dan berpengalaman",
  "Sparepart original dan bergaransi",
  "Estimasi biaya transparan tanpa biaya tersembunyi",
];

const pairs = [
  { before: "/photos/beforeafter/before1.jpg", after: "/photos/beforeafter/after1.jpg", label: "Body Repair" },
  { before: "/photos/beforeafter/before2.jpg", after: "/photos/beforeafter/after2.jpg", label: "Cat Ulang" },
  { before: "/photos/beforeafter/before3.jpg", after: "/photos/beforeafter/after3.jpg", label: "Dent Removal" },
];

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseDown = () => setDragging(true);
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
      className="relative w-full h-full overflow-hidden cursor-col-resize select-none"
      onMouseDown={onMouseDown}
      onTouchMove={(e) => onTouchMove(e.nativeEvent)}
    >
      {/* After image (full) */}
      <div className="absolute inset-0">
        <Image src={after} alt="After" fill className="object-cover" />
        <div className="absolute top-3 right-3 bg-lime text-navy text-xs font-black px-2 py-1 uppercase tracking-wider">
          Sesudah
        </div>
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <Image src={before} alt="Before" fill className="object-cover" />
        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-black px-2 py-1 uppercase tracking-wider">
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
    <section className="py-20 bg-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Before/After Slider */}
          <div className="relative">

            {/* Slider + prev/next sejajar */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="flex items-center justify-center w-9 h-9 shrink-0 border border-white/20 text-white hover:bg-white/10 transition-colors"
                style={{ borderRadius: 0 }}
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex-1 aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                <BeforeAfterSlider
                  key={currentPair}
                  before={pairs[currentPair].before}
                  after={pairs[currentPair].after}
                />
              </div>

              <button
                onClick={next}
                className="flex items-center justify-center w-9 h-9 shrink-0 border border-white/20 text-white hover:bg-white/10 transition-colors"
                style={{ borderRadius: 0 }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Dots + label */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-lime text-xs font-bold uppercase tracking-widest">
                {pairs[currentPair].label}
              </span>
              <div className="flex gap-1.5">
                {pairs.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPair(i)}
                    className={`h-1.5 transition-all ${
                      i === currentPair ? "bg-lime w-4" : "bg-white/30 w-1.5"
                    }`}
                    style={{ borderRadius: 0 }}
                  />
                ))}
              </div>
            </div>

            {/* 48+ badge */}
            <div
              className="absolute -bottom-2 -right-2 bg-lime p-5 shadow-xl"
              style={{ borderRadius: 0 }}
            >
              <p className="text-navy font-black text-4xl leading-none">48+</p>
              <p className="text-navy/70 text-xs font-bold mt-1 uppercase tracking-wider">
                Tahun Pengalaman
              </p>
            </div>
          </div>

          {/* Right — Content */}
          <div>
            <span className="text-lime text-xs font-bold uppercase tracking-[0.2em]">
              — Tentang Kami
            </span>
            <h2 className="text-4xl font-black text-white mt-3 mb-4 uppercase leading-tight">
              Bengkel Terpercaya<br />
              <span className="text-lime">Keluarga Cianjur</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-3 text-sm">
              Cipendawa Motor berdiri sejak tahun 1976 sebagai bengkel spesialis
              body repair di Cianjur. Selama hampir lima dekade, kami telah
              berkembang menjadi bengkel lengkap yang melayani service, sparepart,
              dan variasi kendaraan.
            </p>
            <p className="text-white/60 leading-relaxed mb-8 text-sm">
              Dengan 3 cabang yang tersebar di Cianjur dan Sukabumi, kami
              berkomitmen memberikan pelayanan terbaik dengan standar kualitas
              yang konsisten di setiap cabang.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-lime mt-0.5 shrink-0" />
                  <span className="text-xs text-white/70 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}