"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, MapPin } from "lucide-react";
import { isBookingReceipt, type BookingReceipt } from "@/lib/api/booking";
import styles from "./ReservationFlow.module.css";

const services = [
  { id: "body_repair", name: "Body Repair", description: "Perbaikan bodi dan pengecatan mobil.", image: "/images/layanan/body_repair.png", alt: "Pengerjaan panel bodi mobil" },
  { id: "service", name: "Service", description: "Perawatan untuk kebutuhan mobil Anda.", image: "/images/layanan/service.png", alt: "Perawatan pada ruang mesin mobil" },
  { id: "sparepart", name: "Sparepart & Variasi", description: "Suku cadang dan kelengkapan kendaraan.", image: "/images/layanan/sparepart_variasi.png", alt: "Pemilihan komponen dan variasi mobil" },
] as const;

const branches = [
  { id: "utama", name: "Cipendawa Utama", address: "Jl. Raya Bandung, Cibuarial, Sabandar, Karangtengah, Cianjur" },
  { id: "cianjur2", name: "Cipendawa Cianjur 2", address: "Jl. Raya Sukabumi, Terusan Jl. Siliwangi No.77d, Cianjur" },
  { id: "sukabumi", name: "Cipendawa Sukabumi", address: "Jl. Pelabuhan II No.272A, Dayeuhluhur, Sukabumi" },
] as const;

const periods = [
  { id: "pagi", label: "Pagi", hours: "08.00–11.00", end: "11:00" },
  { id: "siang", label: "Siang", hours: "11.00–14.00", end: "14:00" },
  { id: "sore", label: "Sore", hours: "14.00–17.00", end: "17:00" },
] as const;
const steps = ["Layanan", "Data Anda", "Jadwal"];
const initialData = { service: "", branch: "", name: "", phone: "", email: "", vehicle: "", date: "", period: "", notes: "" };
type Data = typeof initialData;
type Errors = Partial<Record<keyof Data, string>>;
const backendFields: Record<string, keyof Data> = {
  service_code: "service", branch_code: "branch", customer_name: "name", customer_phone: "phone",
  customer_email: "email", customer_vehicle: "vehicle", reservation_date: "date", preferred_period: "period", notes: "notes",
};

function jakartaNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const part = (name: string) => parts.find((item) => item.type === name)?.value ?? "";
  return { date: `${part("year")}-${part("month")}-${part("day")}`, time: `${part("hour")}:${part("minute")}` };
}

function formatDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Belum dipilih";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeZone: "Asia/Jakarta" }).format(new Date(`${value}T12:00:00+07:00`));
}

export default function ReservationFlow() {
  const [data, setData] = useState<Data>(initialData);
  const [step, setStep] = useState(0);
  const [review, setReview] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);
  const submissionRef = useRef<{ payload: string; key: string } | null>(null);
  const submittingRef = useRef(false);
  const [today] = useState(() => jakartaNow().date);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const service = services.find((item) => item.id === data.service);
  const branch = branches.find((item) => item.id === data.branch);
  const period = periods.find((item) => item.id === data.period);

  function update(key: keyof Data, value: string) {
    setSubmitError("");
    setData((current) => ({ ...current, [key]: value, ...(key === "date" ? { period: "" } : {}) }));
    setErrors((current) => ({ ...current, [key]: undefined, ...(key === "date" ? { period: undefined } : {}) }));
  }

  function focusTitle() {
    requestAnimationFrame(() => titleRef.current?.focus());
  }

  function goTo(next: number) {
    if (submittingRef.current || receipt) return;
    setReview(false);
    setStep(next);
    setErrors({});
    focusTitle();
  }

  function validate(target: number): Errors {
    const next: Errors = {};
    if (target === 0) {
      if (!service) next.service = "Pilih layanan untuk kunjungan Anda.";
      if (!branch) next.branch = "Pilih cabang yang ingin Anda kunjungi.";
    }
    if (target === 1) {
      if (data.name.trim().length < 2) next.name = "Isi nama Anda, minimal 2 karakter.";
      const phone = data.phone.replace(/[\s()-]/g, "");
      if (!/^(?:\+62|62|0)8\d{8,11}$/.test(phone)) next.phone = "Gunakan nomor WhatsApp Indonesia, misalnya 081234567890.";
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) next.email = "Periksa kembali alamat email Anda.";
    }
    if (target === 2) {
      const now = jakartaNow();
      const parsed = new Date(`${data.date}T12:00:00+07:00`);
      if (!data.date || Number.isNaN(parsed.getTime())) next.date = "Pilih tanggal kunjungan.";
      else if (data.date < now.date) next.date = "Pilih hari ini atau tanggal setelahnya.";
      else if (parsed.getUTCDay() === 0) next.date = "Bengkel tutup pada hari Minggu. Pilih Senin sampai Sabtu.";
      if (!period) next.period = "Pilih preferensi waktu kunjungan.";
      else if (data.date === now.date && period.end <= now.time) next.period = "Rentang waktu ini sudah lewat. Pilih waktu atau tanggal lain.";
    }
    return next;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const checks = step === 2 ? [0, 1, 2] : [step];
    for (const target of checks) {
      const next = validate(target);
      if (Object.keys(next).length) {
        setErrors(next);
        setStep(target);
        requestAnimationFrame(() => {
          const field = Object.keys(next)[0];
          formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
        });
        return;
      }
    }
    setErrors({});
    if (step < 2) setStep(step + 1);
    else setReview(true);
    focusTitle();
  }

  async function saveReservation() {
    if (submittingRef.current || receipt) return;
    for (const target of [0, 1, 2]) {
      const next = validate(target);
      if (Object.keys(next).length) {
        setReview(false);
        setStep(target);
        setErrors(next);
        focusTitle();
        return;
      }
    }
    submittingRef.current = true;
    setPending(true);
    setSubmitError("");
    try {
      const payload = JSON.stringify({
        service_code: data.service, branch_code: data.branch, reservation_date: data.date,
        preferred_period: data.period, customer_name: data.name.trim(), customer_phone: data.phone.trim(),
        customer_email: data.email.trim(), customer_vehicle: data.vehicle.trim(), notes: data.notes.trim(),
      });
      if (submissionRef.current?.payload !== payload) {
        submissionRef.current = { payload, key: crypto.randomUUID() };
      }
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": submissionRef.current.key },
        body: payload,
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json();
      if (response.ok && result?.success === true && isBookingReceipt(result.data)) {
        setReceipt(result.data);
        focusTitle();
        return;
      }
      const next: Errors = {};
      if (result?.errors && typeof result.errors === "object") {
        for (const [field, message] of Object.entries(result.errors)) {
          const key = backendFields[field];
          if (key && typeof message === "string") next[key] = message;
        }
      }
      setErrors(next);
      const firstField = Object.keys(next)[0] as keyof Data | undefined;
      if (firstField) {
        setReview(false);
        setStep(["service", "branch"].includes(firstField) ? 0 : ["date", "period", "notes"].includes(firstField) ? 2 : 1);
        requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus());
      }
      setSubmitError(typeof result?.message === "string" ? result.message : "Reservasi belum dapat disimpan. Silakan coba lagi.");
    } catch {
      setSubmitError("Belum ada konfirmasi penyimpanan. Coba lagi dengan isian yang sama untuk memeriksa hasilnya.");
    } finally {
      submittingRef.current = false;
      setPending(false);
    }
  }

  function restart() {
    setReceipt(null);
    setData(initialData);
    setReview(false);
    setStep(0);
    setErrors({});
    setSubmitError("");
    submissionRef.current = null;
    focusTitle();
  }

  function fieldError(key: keyof Data) {
    return errors[key] ? <p className={styles.error} id={`${key}-error`}>{errors[key]}</p> : null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.backLink} href="/"><ArrowLeft size={16} aria-hidden="true" /> Kembali ke beranda</Link>
        <header className={styles.header}>
          <h1>Rencanakan<br /><span>kunjungan Anda.</span></h1>
          <div className={styles.intro}>
            <p>Pilih layanan, tentukan cabang, lalu atur waktu yang cocok untuk mobil Anda.</p>
            <p className={styles.previewNote}>Demo reservasi: data disimpan. WhatsApp simulasi, tidak ada pesan terkirim.</p>
          </div>
        </header>

        <div className={styles.workspace}>
          <section className={styles.formPanel} aria-label="Form reservasi">
            <nav aria-label="Tahapan reservasi" className={styles.steps}>
              {steps.map((label, index) => (
                <button type="button" key={label} disabled={index > step || pending || !!receipt} aria-current={!review && step === index ? "step" : undefined} onClick={() => goTo(index)} className={`${styles.step} ${index <= step ? styles.reached : ""}`}>
                  <span className={styles.stepNumber}>{index < step || review ? <Check size={15} aria-hidden="true" /> : index + 1}</span>
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            {review ? (
              <div className={styles.formBody} aria-busy={pending}>
                <h2 ref={titleRef} tabIndex={-1}>{receipt ? "Reservasi tersimpan" : "Rencana kunjungan Anda"}</h2>
                <p className={styles.lead}>{receipt ? "Simpan kode reservasi Anda. Jadwal masih menunggu konfirmasi tim bengkel." : "Periksa kembali detailnya sebelum menyimpan reservasi."}</p>
                <div className={styles.reviewNotice} role="status">
                  {receipt ? <><strong>Kode reservasi: {receipt.booking_code}</strong><p>Status: pending · Menunggu konfirmasi</p><p>WhatsApp simulasi, tidak ada pesan terkirim.</p><p>{receipt.notification.message}</p></> : <><strong>Belum disimpan</strong><p>Reservasi dibuat setelah Anda menekan Simpan reservasi. Jadwal tetap perlu dikonfirmasi tim bengkel. WhatsApp simulasi, tidak ada pesan terkirim.</p></>}
                </div>
                {submitError && <p role="alert" className={styles.errorSummary}>{submitError}</p>}
                <dl className={styles.reviewList}>
                  {[["Layanan", service?.name], ["Cabang", branch?.name], ["Nama", data.name.trim()], ["WhatsApp", data.phone], ["Email", data.email.trim() || "Tidak diisi"], ["Mobil", data.vehicle.trim() || "Belum diisi"], ["Tanggal", formatDate(data.date)], ["Preferensi waktu", `${period?.label} · ${period?.hours} WIB`], ["Catatan", data.notes.trim() || "Tidak ada catatan"]].map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
                <div className={styles.actions}>
                  {receipt ? <button type="button" className={styles.primary} onClick={restart}>Buat reservasi baru <ArrowRight size={17} aria-hidden="true" /></button> : <>
                    <button type="button" className={styles.secondary} disabled={pending} onClick={() => goTo(2)}>Ubah isian</button>
                    <button type="button" className={styles.primary} disabled={pending} onClick={saveReservation}>{pending ? "Menyimpan reservasi…" : "Simpan reservasi"}<ArrowRight size={17} aria-hidden="true" /></button>
                  </>}
                </div>
                <p className={styles.footnote}>{receipt ? "Reservasi dan catatan notifikasi simulasi telah disimpan." : "Jika penyimpanan gagal, isian tetap tersedia selama halaman ini terbuka."}</p>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={submit} className={styles.formBody}>
                <h2 ref={titleRef} tabIndex={-1}>{["Apa yang mobil Anda butuhkan?", "Kenalan dulu, yuk.", "Kapan ingin berkunjung?"][step]}</h2>
                <p className={styles.lead}>{["Pilih satu layanan untuk memulai kunjungan Anda.", "Isi kontak yang bisa dihubungi untuk konfirmasi kunjungan.", "Pilih tanggal dan rentang waktu yang Anda inginkan."][step]}</p>
                <p className={styles.requiredHint}>Isian tanpa label Opsional wajib diisi.</p>
                {submitError && <p role="alert" className={styles.errorSummary}>{submitError}</p>}
                {Object.values(errors).some(Boolean) && <p role="alert" className={styles.errorSummary}>Ada isian yang perlu diperiksa. Lihat keterangan di bawahnya.</p>}

                {step === 0 && <>
                  <fieldset className={styles.serviceList} aria-describedby={errors.service ? "service-error" : undefined}>
                    <legend className={styles.srOnly}>Layanan yang ingin direservasi</legend>
                    {services.map((item) => <label key={item.id} className={`${styles.service} ${data.service === item.id ? styles.selected : ""}`}>
                      <input type="radio" required name="service" value={item.id} checked={data.service === item.id} onChange={() => update("service", item.id)} />
                      <span className={styles.serviceCopy}><strong>{item.name}</strong><span>{item.description}</span></span>
                      <span className={styles.servicePhoto}><Image src={item.image} alt="" fill loading={item.id === "body_repair" ? "eager" : "lazy"} sizes="(max-width: 600px) 95px, 170px" className={styles.photo} /></span>
                    </label>)}
                  </fieldset>
                  {fieldError("service")}
                  <div className={styles.field}>
                    <label htmlFor="branch">Cabang tujuan</label>
                    <select id="branch" name="branch" required value={data.branch} onChange={(e) => update("branch", e.target.value)} aria-invalid={!!errors.branch} aria-describedby={errors.branch ? "branch-error" : "branch-detail"}>
                      <option value="">Pilih cabang bengkel</option>
                      {branches.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
                    </select>
                    <p id="branch-detail" className={styles.hint}>{branch?.address || "Tersedia di Cianjur dan Sukabumi."}</p>
                    {fieldError("branch")}
                  </div>
                </>}

                {step === 1 && <div className={styles.fields}>
                  <div className={styles.field}><label htmlFor="name">Nama lengkap</label><input id="name" name="name" required autoComplete="name" maxLength={100} value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Nama Anda" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{fieldError("name")}</div>
                  <div className={styles.field}><label htmlFor="phone">Nomor WhatsApp</label><input id="phone" name="phone" required type="tel" autoComplete="tel" maxLength={22} value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="08xxxxxxxxxx" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : "phone-hint"} /><p id="phone-hint" className={styles.hint}>Gunakan nomor aktif yang bisa dihubungi tim bengkel.</p>{fieldError("phone")}</div>
                  <div className={styles.field}><label htmlFor="email">Email <span>Opsional</span></label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="nama@email.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{fieldError("email")}</div>
                  <div className={styles.field}><label htmlFor="vehicle">Mobil Anda <span>Opsional</span></label><input id="vehicle" name="vehicle" maxLength={120} value={data.vehicle} onChange={(e) => update("vehicle", e.target.value)} placeholder="Contoh: Toyota Avanza 2020" aria-invalid={!!errors.vehicle} aria-describedby={errors.vehicle ? "vehicle-error" : undefined} /><p className={styles.hint}>Merek, model, dan tahun jika diketahui.</p>{fieldError("vehicle")}</div>
                </div>}

                {step === 2 && <div className={styles.fields}>
                  <div className={styles.field}><label htmlFor="date">Tanggal kunjungan</label><input id="date" name="date" required type="date" min={today} value={data.date} onChange={(e) => update("date", e.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? "date-error" : "date-hint"} /><p id="date-hint" className={styles.hint}>Senin–Sabtu. Hari Minggu bengkel tutup.</p>{fieldError("date")}</div>
                  <fieldset className={styles.periodField} aria-describedby={errors.period ? "period-error" : "period-hint"}>
                    <legend>Preferensi waktu <span>WIB</span></legend>
                    <div className={styles.periods}>{periods.map((item) => <label key={item.id} className={`${styles.period} ${data.period === item.id ? styles.periodSelected : ""}`}><input type="radio" required name="period" value={item.id} checked={data.period === item.id} onChange={() => update("period", item.id)} /><strong>{item.label}</strong><span>{item.hours}</span></label>)}</div>
                    <p id="period-hint" className={styles.hint}>Ini preferensi kunjungan. Ketersediaan dan jam pasti akan dikonfirmasi tim.</p>{fieldError("period")}
                  </fieldset>
                  <div className={styles.field}><label htmlFor="notes">Ada yang perlu kami tahu? <span>Opsional</span></label><textarea id="notes" name="notes" rows={4} maxLength={1000} value={data.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Ceritakan keluhan atau kebutuhan mobil Anda." aria-invalid={!!errors.notes} aria-describedby={errors.notes ? "notes-error" : undefined} /><p className={styles.hint}>{data.notes.length}/1.000 karakter</p>{fieldError("notes")}</div>
                </div>}

                <div className={styles.actions}>
                  {step > 0 ? <button type="button" className={styles.secondary} onClick={() => goTo(step - 1)}><ArrowLeft size={16} aria-hidden="true" /> Kembali</button> : <span className={styles.stepCaption}>Langkah 1 dari 3</span>}
                  <button type="submit" className={styles.primary}>{["Lanjut ke data diri", "Lanjut ke jadwal", "Lihat ringkasan"][step]}<ArrowRight size={17} aria-hidden="true" /></button>
                </div>
              </form>
            )}
          </section>

          <aside className={styles.summary} aria-label="Ringkasan kunjungan">
            <div className={styles.summaryHeading}><h2>Kunjungan Anda</h2><span>{receipt ? "Tersimpan" : review ? "Periksa isian" : `${step + 1} / 3`}</span></div>
            <div className={styles.summaryPhoto}>
              <Image src={service?.image || "/photos/1.jpg"} alt={service?.alt || "Bengkel Cipendawa Motor"} fill loading="eager" sizes="(max-width: 900px) 1px, 360px" className={styles.photo} />
            </div>
            <dl className={styles.summaryList}>
              <div><dt>Layanan</dt><dd>{service?.name || "Pilih kebutuhan mobil Anda"}</dd></div>
              <div><dt>Cabang</dt><dd>{branch?.name || "Belum dipilih"}</dd></div>
              <div><dt>Tanggal</dt><dd>{formatDate(data.date)}</dd></div>
              <div><dt>Waktu</dt><dd>{period ? `${period.label} · ${period.hours} WIB` : "Belum dipilih"}</dd></div>
            </dl>
            <div className={styles.hours}><Clock3 size={18} aria-hidden="true" /><p>Senin–Sabtu, 08.00–17.00 WIB<span>Minggu tutup</span></p></div>
            <Link href="/#lokasi" className={styles.locationLink}><MapPin size={17} aria-hidden="true" /> Lihat lokasi bengkel</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
