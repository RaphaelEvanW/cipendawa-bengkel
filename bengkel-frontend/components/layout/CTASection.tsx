import Link from "next/link";
import { Phone } from "lucide-react";
import { workshopContacts } from "@/lib/content/workshop";
import styles from "./CTASection.module.css";

export default function CTASection() {
  return (
    <section id="kontak" aria-labelledby="contact-heading" className={`${styles.section} scroll-mt-24 py-16 sm:py-20 bg-navy`}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/15 pt-10 sm:pt-12 text-center">
            <h2 id="contact-heading" className="text-2xl min-[480px]:text-3xl sm:text-4xl font-bold text-white mb-4">
              Hubungi tim Cipendawa Motor
            </h2>
            <p className="text-white/85 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Tanyakan layanan, ketersediaan suku cadang, atau estimasi biaya.
              Pilih tim yang sesuai dengan kebutuhan mobil Anda.
            </p>

            <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-2 sm:gap-3 max-w-4xl mx-auto">
              {workshopContacts.map((contact) => (
                <a
                  key={contact.id}
                  href={`https://wa.me/${contact.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-18 sm:min-h-14 items-center justify-center gap-1 sm:gap-2 bg-lime text-navy text-xs min-[480px]:text-sm sm:text-base font-bold px-2 sm:px-4 py-3 sm:py-4 hover:bg-lime-dark transition-colors"
                >
                  <Phone size={18} aria-hidden="true" className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 shrink-0" />
                  <span>WhatsApp {contact.label}</span>
                </a>
              ))}
            </div>
            <Link href="/#lokasi" className="inline-flex min-h-11 items-center mt-5 text-white/85 underline underline-offset-4 hover:text-lime">
              Lihat lokasi dan jam operasional
            </Link>
        </div>
      </div>
    </section>
  );
}
