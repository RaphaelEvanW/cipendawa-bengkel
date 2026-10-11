"use client";
import Image from "next/image";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Layanan & Harga" },
  { href: "/reservasi", label: "Reservasi" },
  { href: "/cek-status", label: "Cek Status" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy/75 backdrop-blur-md shadow-lg shadow-black/30"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo/cma_white.png"
              alt="Cipendawa Motor"
              width={90}
              height={100}
              className="object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative group ${
                  pathname === link.href
                    ? "text-lime"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {/* Active underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-lime transition-all duration-200 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/reservasi"
              className="hidden md:inline-flex items-center gap-2 bg-lime text-navy font-black px-5 py-2.5 text-xs uppercase tracking-wider hover:bg-lime-dark transition-colors"
              style={{ borderRadius: 0 }}
            >
              Booking Sekarang →
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-1"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-navy/95 backdrop-blur-md border-t border-white/10 px-4 py-5 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-lime"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reservasi"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center bg-lime text-navy font-black px-5 py-3 text-xs uppercase tracking-wider hover:bg-lime-dark transition-colors"
            style={{ borderRadius: 0 }}
          >
            Booking Sekarang →
          </Link>
        </div>
      )}
    </nav>
  );
}