import Link from "next/link";
import Image from "next/image";
import { workshopContacts } from "@/lib/content/workshop";

const services = [
  {
    id: "body_repair",
    name: "Body Repair",
    image: "/images/layanan/body_repair.png",
    imageAlt: "Proses pengamplasan panel bodi mobil sebelum pengecatan",
    description: "Layanan perbaikan bodi mobil. Diskusikan kondisi kendaraan Anda dengan tim Body Repair.",
  },
  {
    id: "service",
    name: "Service",
    image: "/images/layanan/service.png",
    imageAlt: "Pengerjaan perawatan mobil pada ruang mesin",
    description: "Layanan perawatan mobil. Sampaikan kebutuhan kendaraan Anda kepada tim Service.",
  },
  {
    id: "sparepart",
    name: "Sparepart & Variasi",
    image: "/images/layanan/sparepart_variasi.png",
    imageAlt: "Pemilihan komponen mobil di antara rak sparepart dan velg",
    description: "Kebutuhan suku cadang dan variasi mobil. Tanyakan ketersediaan serta kesesuaian untuk kendaraan Anda.",
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
            <p className="mt-5 max-w-sm leading-relaxed text-white/75">
              Body repair, service, sparepart, dan variasi di Cipendawa Motor.
              Hubungi tim sesuai kebutuhan kendaraan Anda.
            </p>
            <p className="mt-8 hidden max-w-xs border-t border-white/20 pt-5 text-sm leading-relaxed text-white/70 lg:block">
              Halaman detail layanan belum tersedia. Untuk informasi lebih lanjut,{" "}
              <Link href="/#kontak" className={contactLinkClass}>
                pilih WhatsApp sesuai kebutuhan Anda
              </Link>
            </p>
          </div>

        <div className="min-w-0 space-y-6 sm:space-y-8">
          {services.map((service) => {
            const contact = workshopContacts.find((item) => item.id === service.id);

            return (
              <article key={service.id} className="relative isolate bg-navy sm:flex sm:min-h-[430px] sm:items-end">
                <div className="relative aspect-[4/3] sm:absolute sm:inset-0 sm:aspect-auto">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(min-width: 1280px) 825px, (min-width: 1024px) 66vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                    className="object-cover object-[65%_center]"
                  />
                  <div aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-r from-navy/95 via-navy/55 to-transparent sm:block" />
                </div>
                <div className="relative z-10 px-6 py-7 sm:w-[58%] sm:p-8 xl:w-[54%] xl:p-10">
                <h3 className="text-3xl font-black uppercase leading-[1.04] tracking-tight text-white sm:text-4xl xl:text-[2.75rem]">{service.name}</h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80 sm:text-base">{service.description}</p>
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

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/70 lg:hidden">
          Halaman detail layanan belum tersedia. Untuk informasi lebih lanjut,{" "}
          <Link href="/#kontak" className={contactLinkClass}>
            pilih WhatsApp sesuai kebutuhan Anda
          </Link>
        </p>
      </div>
    </section>
  );
}
