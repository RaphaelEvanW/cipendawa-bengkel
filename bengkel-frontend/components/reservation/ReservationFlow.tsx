"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, MapPin } from "lucide-react";
import { isBookingReceipt, type BookingReceipt } from "@/lib/api/booking";
import styles from "./ReservationFlow.module.css";

const services = [
  { id: "body_repair", name: "Body Repair", description: "Perbaikan bodi dan pengecatan mobil.", image: "/images/layanan/body_repair.png", alt: "Pengerjaan panel bodi mobil" },
  { id: "service", name: "Service", description: "Servis dan perawatan mobil.", image: "/images/layanan/service.png", alt: "Perawatan pada ruang mesin mobil" },
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
  const [copyStatus, setCopyStatus] = useState("");
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
      if (!service) next.service = "Pilih layanan yang Anda butuhkan.";
      if (!branch) next.branch = "Pilih cabang yang ingin Anda kunjungi.";
    }
    if (target === 1) {
      if (data.name.trim().length < 2) next.name = "Masukkan nama, minimal 2 karakter.";
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
      if (!period) next.period = "Pilih rentang waktu kunjungan.";
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
      setSubmitError("Kami belum dapat memastikan reservasi tersimpan. Coba lagi dengan isian yang sama agar tidak membuat reservasi ganda.");
    } finally {
      submittingRef.current = false;
      setPending(false);
    }
  }

  function restart() {
    setCopyStatus("");
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

  async function copyBookingCode() {
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(receipt.booking_code);
      setCopyStatus("Kode disalin");
    } catch {
      setCopyStatus("Kode belum dapat disalin. Pilih teks kode di atas untuk menyalinnya secara manual.");
    }
  }

  if (receipt) {
    const visitDate = new Date(`${data.date}T12:00:00+07:00`);
    const dateLabel = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(visitDate);
    const weekday = new Intl.DateTimeFormat("id-ID", { weekday: "long", timeZone: "Asia/Jakarta" }).format(visitDate);

    return (
      <div className={`${styles.page} ${styles.receiptPage}`}>
        <div className={styles.receiptShell}>
          <header className={styles.receiptHeading}>
            <div>
              <p className={styles.savedState}><Check size={18} aria-hidden="true" /> Data berhasil disimpan</p>
              <h1 ref={titleRef} tabIndex={-1}>Reservasi Anda tersimpan.</h1>
              <p>Terima kasih, {data.name.trim()}. Periksa rincian kunjungan Anda di bawah ini.</p>
            </div>
            <Link href="/" className={styles.receiptHome}>Kembali ke beranda <ArrowRight size={16} aria-hidden="true" /></Link>
          </header>

          <section className={styles.receiptSheet} aria-label="Bukti reservasi">
            <div className={styles.receiptMain}>
              <div className={styles.receiptCode}>
                <div>
                  <span>Kode reservasi</span>
                  <strong>{receipt.booking_code}</strong>
                </div>
                <button type="button" onClick={copyBookingCode} className={styles.copyButton}>
                  {copyStatus === "Kode disalin" ? <><Check size={15} aria-hidden="true" /> Disalin</> : "Salin kode"}
                </button>
              </div>
              <p role="status" className={styles.copyStatus}>{copyStatus}</p>

              <div className={styles.visitSchedule}>
                <div>
                  <span>{weekday}</span>
                  <p>{dateLabel}</p>
                </div>
                <div>
                  <span>Preferensi waktu · {period?.label}</span>
                  <p>{period?.hours}<small> WIB</small></p>
                </div>
              </div>

              <div className={styles.confirmationNote}>
                <Clock3 size={18} aria-hidden="true" />
                <div><strong>Menunggu konfirmasi bengkel</strong><p>Jadwal yang Anda pilih perlu dikonfirmasi oleh tim bengkel.</p></div>
              </div>

              <dl className={styles.receiptDetails}>
                <div><dt>Layanan</dt><dd>{service?.name}</dd></div>
                <div><dt>Cabang tujuan</dt><dd>{branch?.name}<span>{branch?.address}</span></dd></div>
                <div><dt>Atas nama</dt><dd>{data.name.trim()}<span>{data.phone}</span></dd></div>
                {data.vehicle.trim() && <div><dt>Mobil</dt><dd>{data.vehicle.trim()}</dd></div>}
                {data.email.trim() && <div><dt>Email</dt><dd>{data.email.trim()}</dd></div>}
                {data.notes.trim() && <div><dt>Catatan</dt><dd>{data.notes.trim()}</dd></div>}
              </dl>
              <p className={styles.receiptKeep}>Simpan kode reservasi atau ambil tangkapan layar halaman ini untuk ditunjukkan saat berkunjung.</p>
            </div>

            <aside className={styles.receiptAside} aria-label="Informasi setelah reservasi">
              <div className={styles.receiptPhoto}>
                <Image src={service?.image || "/photos/1.jpg"} alt={service?.alt || "Bengkel Cipendawa Motor"} fill sizes="(max-width: 700px) 100vw, 360px" className={styles.photo} />
              </div>
              <div className={styles.receiptAsideBody}>
                <h2>Sebelum berkunjung</h2>
                <p>Konfirmasikan jadwal dengan tim bengkel sebelum datang. Sebutkan kode reservasi agar detail kunjungan Anda mudah ditemukan.</p>
                <div className={styles.receiptHours}><span>Jam operasional</span><p>Senin–Sabtu<br />08.00–17.00 WIB</p><span>Minggu tutup</span></div>
                <Link href="/#lokasi" className={styles.receiptLocation}>Lihat lokasi bengkel <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </aside>
          </section>

          <div className={styles.receiptFooter}>
            <div className={styles.simulationNote}>
              <p><strong>Mode demo.</strong> Data reservasi tersimpan. Pesan WhatsApp hanya berupa simulasi dan tidak dikirim.</p>
              <details><summary>Lihat simulasi pesan WhatsApp</summary><p>{receipt.notification.message}</p></details>
            </div>
            <button type="button" onClick={restart} className={styles.newReservation}>Buat reservasi lain <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.backLink} href="/"><ArrowLeft size={16} aria-hidden="true" /> Kembali ke beranda</Link>
        <header className={styles.header}>
          <h1>Rencanakan<br /><span>kunjungan Anda.</span></h1>
          <div className={styles.intro}>
            <p>Pilih layanan, cabang tujuan, dan waktu kunjungan. Jadwal perlu dikonfirmasi oleh tim bengkel.</p>
            <p className={styles.previewNote}>Mode demo: data reservasi tersimpan. Pesan WhatsApp tidak dikirim.</p>
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
                <h2 ref={titleRef} tabIndex={-1}>Rencana kunjungan Anda</h2>
                <p className={styles.lead}>Pastikan rincian kunjungan sudah benar sebelum menyimpan reservasi.</p>
                <div className={styles.reviewNotice} role="status">
                  <strong>Reservasi belum disimpan</strong><p>Tekan Simpan reservasi untuk melanjutkan. Jadwal perlu dikonfirmasi oleh tim bengkel. Pada mode demo, pesan WhatsApp tidak dikirim.</p>
                </div>
                {submitError && <p role="alert" className={styles.errorSummary}>{submitError}</p>}
                <dl className={styles.reviewList}>
                  {[["Layanan", service?.name], ["Cabang", branch?.name], ["Nama", data.name.trim()], ["WhatsApp", data.phone], ["Email", data.email.trim() || "Tidak diisi"], ["Mobil", data.vehicle.trim() || "Tidak diisi"], ["Tanggal", formatDate(data.date)], ["Preferensi waktu", `${period?.label} · ${period?.hours} WIB`], ["Catatan", data.notes.trim() || "Tidak ada catatan"]].map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
                <div className={styles.actions}>
                    <button type="button" className={styles.secondary} disabled={pending} onClick={() => goTo(2)}>Ubah isian</button>
                    <button type="button" className={styles.primary} disabled={pending} onClick={saveReservation}>{pending ? "Menyimpan reservasi…" : "Simpan reservasi"}<ArrowRight size={17} aria-hidden="true" /></button>
                </div>
                <p className={styles.footnote}>Jika reservasi gagal disimpan, Anda bisa mencoba lagi tanpa mengisi ulang selama halaman ini tetap terbuka.</p>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={submit} className={styles.formBody}>
                <h2 ref={titleRef} tabIndex={-1}>{["Pilih layanan dan cabang", "Data pelanggan", "Jadwal kunjungan"][step]}</h2>
                <p className={styles.lead}>{["Pilih layanan yang dibutuhkan dan cabang yang ingin Anda kunjungi.", "Masukkan kontak yang dapat dihubungi untuk konfirmasi jadwal.", "Pilih tanggal dan rentang waktu kunjungan yang Anda inginkan."][step]}</p>
                <p className={styles.requiredHint}>Semua kolom wajib diisi, kecuali yang bertanda Opsional.</p>
                {submitError && <p role="alert" className={styles.errorSummary}>{submitError}</p>}
                {Object.values(errors).some(Boolean) && <p role="alert" className={styles.errorSummary}>Periksa kolom yang ditandai sebelum melanjutkan.</p>}

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
                    <p id="period-hint" className={styles.hint}>Waktu yang dipilih belum merupakan jadwal pasti. Konfirmasikan ketersediaannya dengan tim bengkel.</p>{fieldError("period")}
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
              <div><dt>Layanan</dt><dd>{service?.name || "Belum dipilih"}</dd></div>
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
