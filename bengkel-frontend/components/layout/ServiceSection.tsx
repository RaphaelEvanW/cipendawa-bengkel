import Link from "next/link";
import Image from "next/image";
import { workshopContacts } from "@/lib/content/workshop";

const services = [
  {
    id: "body_repair",
    name: "Body Repair",
    image: "/images/layanan/body_repair.png",
    imageAlt: "Proses pengamplasan panel bodi mobil sebelum pengecatan",
    description: "Perbaikan bodi dan pengecatan mobil. Ceritakan bagian yang ingin diperbaiki agar tim kami bisa membantu.",
  },
  {
    id: "service",
    name: "Service",
    image: "/images/layanan/service.png",
    imageAlt: "Pengerjaan perawatan mobil pada ruang mesin",
    description: "Ada keluhan pada mobil atau sudah waktunya servis? Bahas kondisi dan kebutuhan perawatan mobil Anda dengan tim kami.",
  },
  {
    id: "sparepart",
    name: "Sparepart & Variasi",
    image: "/images/layanan/sparepart_variasi.png",
    imageAlt: "Pemilihan komponen mobil di antara rak sparepart dan velg",
    description: "Cari suku cadang atau variasi untuk mobil Anda. Cek ketersediaan dan kecocokannya sebelum berkunjung.",
  },
] as const;

const contactLinkClass =
  "inline-flex min-h-11 items-center py-2 text-sm font-medium text-lime underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime";

export default function ServiceSection() {
  return (
    <section id="layanan" aria-labelledby="layanan-heading" className="scroll-mt-24 bg-navy-light py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <h2 id="layanan-heading" className="max-w-lg text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[2.75rem]">
              Layanan untuk <span className="text-lime">mobil Anda.</span>
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-white/85">
              Body repair, service, sparepart, dan variasi di Cipendawa Motor.
              Hubungi tim sesuai kebutuhan kendaraan Anda.
            </p>
          </div>

        <div className="min-w-0 space-y-6 sm:space-y-8">
          {services.map((service) => {
            const contact = workshopContacts.find((item) => item.id === service.id);

            return (
              <article key={service.id} className="relative isolate flex min-h-[380px] items-end bg-navy sm:min-h-[430px]">
                <div className="absolute inset-0">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    loading={service.id === "body_repair" ? "eager" : "lazy"}
                    sizes="(min-width: 1280px) 825px, (min-width: 1024px) 66vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                    className="object-cover object-[65%_center]"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-navy/10 sm:via-navy/55 sm:to-transparent" />
                </div>
                <div className="relative z-10 w-[78%] px-5 py-7 sm:w-[58%] sm:p-8 xl:w-[54%] xl:p-10">
                <h3 className="text-3xl font-black uppercase leading-[1.04] tracking-tight text-white sm:text-4xl xl:text-[2.75rem]">{service.name}</h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85 sm:text-base">{service.description}</p>
                {contact ? (
                  <a
                    href={`https://wa.me/${contact.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${contactLinkClass} mt-5 border-b border-lime/60 pb-2 hover:border-lime`}
                  >
                    WhatsApp {contact.label}
                  </a>
                ) : (
                  <Link href="/#kontak" className={`${contactLinkClass} mt-2`}>
                    Pilih tim untuk dihubungi
                  </Link>
                )}
                </div>
              </article>
            );
          })}
        </div>
        </div>

      </div>
    </section>
  );
}
