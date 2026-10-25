"use client";
import Image from "next/image";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { publicNavLinks } from "@/lib/content/workshop";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <nav
      aria-label="Navigasi utama"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-navy/75 backdrop-blur-md shadow-lg shadow-black/30"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo/cma_white.png"
              alt="Cipendawa Motor"
              width={952}
              height={481}
              className="h-auto w-[90px] object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm font-bold text-white hover:text-lime transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/#kontak"
              className="hidden min-h-11 md:inline-flex items-center gap-2 bg-lime text-navy font-black px-5 py-2.5 text-xs uppercase tracking-wider hover:bg-lime-dark transition-colors"
              style={{ borderRadius: 0 }}
            >
              Hubungi Bengkel
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-3 font-bold text-white"
            >
              <span className="text-sm">Menu</span>
              {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

        <div
          id="mobile-navigation"
          hidden={!isOpen}
          className={`${isOpen ? "flex" : "hidden"} md:hidden border-t border-white/20 px-4 py-5 flex-col gap-2`}
        >
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="inline-flex min-h-11 items-center border-b border-white/25 pb-2 text-sm font-bold text-white hover:text-lime transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#kontak"
            onClick={() => setIsOpen(false)}
            className="inline-flex min-h-11 items-center justify-center bg-lime text-navy font-black px-5 py-3 text-xs uppercase tracking-wider hover:bg-lime-dark transition-colors"
            style={{ borderRadius: 0 }}
          >
            Hubungi Bengkel
          </Link>
        </div>
    </nav>
  );
}
