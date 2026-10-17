import Link from "next/link";
import { workshopContacts } from "@/lib/content/workshop";

const services = [
  {
    id: "body_repair",
    name: "Body Repair",
    description: "Layanan perbaikan bodi mobil. Diskusikan kondisi kendaraan Anda dengan tim Body Repair.",
  },
  {
    id: "service",
    name: "Service",
    description: "Layanan perawatan mobil. Sampaikan kebutuhan kendaraan Anda kepada tim Service.",
  },
  {
    id: "sparepart",
    name: "Sparepart",
    description: "Kebutuhan suku cadang mobil. Tanyakan ketersediaan dan kesesuaian untuk kendaraan Anda.",
  },
  {
    id: "variasi",
    name: "Variasi",
    description: "Kebutuhan variasi mobil. Hubungi kami untuk menanyakan pilihan yang tersedia.",
  },
] as const;

const contactLinkClass =
  "inline-flex min-h-11 items-center py-2 text-sm font-medium text-lime underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime";

export default function ServiceSection() {
  return (
    <section id="layanan" aria-labelledby="layanan-heading" className="scroll-mt-24 bg-navy-light py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 id="layanan-heading" className="text-3xl font-bold text-white sm:text-4xl">
            Layanan untuk mobil Anda
          </h2>
          <p className="mt-3 leading-relaxed text-white/70">
            Body repair, service, sparepart, dan variasi di Cipendawa Motor.
            Hubungi tim sesuai kebutuhan kendaraan Anda.
          </p>
        </div>

        <div className="grid gap-x-12 md:grid-cols-2">
          {services.map((service) => {
            const contact = workshopContacts.find((item) => item.id === service.id);

            return (
              <article key={service.id} className="border-t border-white/20 py-6">
                <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                <p className="mt-2 max-w-prose leading-relaxed text-white/70">{service.description}</p>
                {contact ? (
                  <a
                    href={`https://wa.me/${contact.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${contactLinkClass} mt-2`}
                  >
                    WhatsApp {contact.label}
                  </a>
                ) : (
                  <Link href="/#kontak" className={`${contactLinkClass} mt-2`}>
                    Pilih tim untuk dihubungi
                  </Link>
                )}
              </article>
            );
          })}
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70">
          Halaman detail layanan belum tersedia. Untuk informasi lebih lanjut,{" "}
          <Link href="/#kontak" className={contactLinkClass}>
            pilih WhatsApp sesuai kebutuhan Anda
          </Link>.
        </p>
      </div>
    </section>
  );
}
