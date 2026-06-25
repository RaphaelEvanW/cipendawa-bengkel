"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getServices } from "@/lib/api/services";
import { Service } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";
import { Wrench, Car, Package, Sparkles } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  service: <Wrench size={20} />,
  body_repair: <Car size={20} />,
  sparepart: <Package size={20} />,
  variasi: <Sparkles size={20} />,
};

const CATEGORY_LABELS: Record<string, string> = {
  service: "Service",
  body_repair: "Body Repair",
  sparepart: "Sparepart",
  variasi: "Variasi",
};

export default function ServiceSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    getServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(services.map((s) => s.category)))];

  const filtered =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <section className="py-20 bg-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-lime text-sm font-semibold uppercase tracking-widest">
            Layanan Kami
          </span>
          <h2 className="text-4xl font-bold text-white mt-2">
            Solusi Lengkap untuk Kendaraan Anda
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Dari body repair hingga variasi, kami siap menangani semua kebutuhan
            kendaraan Anda dengan teknisi berpengalaman.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-lime text-navy"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {cat === "all" ? "Semua" : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Service cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-navy rounded-xl p-6 animate-pulse h-40"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => (
              <div
                key={service.id}
                className="bg-navy border border-white/10 rounded-xl p-6 hover:border-lime/30 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center text-lime group-hover:bg-lime group-hover:text-navy transition-colors">
                    {CATEGORY_ICONS[service.category] || <Wrench size={20} />}
                  </div>
                  <span className="text-xs text-white/40 uppercase tracking-wider">
                    {CATEGORY_LABELS[service.category] || service.category}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  {service.name}
                </h3>
                <p className="text-white/50 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>
                <p className="text-lime font-bold">
                  Mulai dari {formatRupiah(service.price_estimate)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 text-lime font-medium hover:underline"
          >
            Lihat Semua Layanan →
          </Link>
        </div>
      </div>
    </section>
  );
}