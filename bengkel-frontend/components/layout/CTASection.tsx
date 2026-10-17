import Link from "next/link";
import { Phone } from "lucide-react";
import { workshopContacts } from "@/lib/content/workshop";

export default function CTASection() {
  return (
    <section id="kontak" aria-labelledby="contact-heading" className="scroll-mt-24 py-16 sm:py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/15 pt-10 sm:pt-12 text-center">
            <h2 id="contact-heading" className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Hubungi Tim Cipendawa Motor
            </h2>
            <p className="text-white/75 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Pilih WhatsApp sesuai kebutuhan mobil Anda. Tanyakan layanan,
              kebutuhan sparepart, atau estimasi biaya langsung kepada tim kami.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
              {workshopContacts.map((contact) => (
                <a
                  key={contact.id}
                  href={`https://wa.me/${contact.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-14 items-center justify-center gap-2 bg-lime text-navy font-bold px-4 py-4 hover:bg-lime-dark transition-colors"
                >
                  <Phone size={18} aria-hidden="true" />
                  WhatsApp {contact.label}
                </a>
              ))}
            </div>
            <Link href="/#lokasi" className="inline-flex min-h-11 items-center mt-5 text-white/80 underline underline-offset-4 hover:text-lime">
              Lihat lokasi dan jam operasional
            </Link>
        </div>
      </div>
    </section>
  );
}
