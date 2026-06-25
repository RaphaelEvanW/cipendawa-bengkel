import { Shield, Clock, Award, Users, MapPin, Wrench } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Pengalaman 48+ Tahun",
    description:
      "Berdiri sejak 1976, kami telah melayani puluhan ribu pelanggan dengan standar kualitas yang terus meningkat.",
  },
  {
    icon: Shield,
    title: "Garansi Pengerjaan",
    description:
      "Setiap pekerjaan dilengkapi dengan garansi resmi. Kami bertanggung jawab atas kualitas hasil kerja kami.",
  },
  {
    icon: Wrench,
    title: "Teknisi Berpengalaman",
    description:
      "Tim teknisi profesional dengan pengalaman puluhan tahun di bidang body repair, service, dan variasi kendaraan.",
  },
  {
    icon: Users,
    title: "Pelayanan Ramah",
    description:
      "Kami mengutamakan kepuasan pelanggan dengan pelayanan yang ramah, transparan, dan profesional.",
  },
  {
    icon: MapPin,
    title: "3 Lokasi Strategis",
    description:
      "Hadir di 3 lokasi strategis di Cianjur dan Sukabumi untuk memudahkan akses pelanggan kami.",
  },
  {
    icon: Clock,
    title: "Estimasi Tepat Waktu",
    description:
      "Kami berkomitmen menyelesaikan pekerjaan sesuai estimasi waktu yang telah disepakati bersama.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-lime text-sm font-semibold uppercase tracking-widest">
            Keunggulan Kami
          </span>
          <h2 className="text-4xl font-bold text-white mt-2">
            Mengapa Memilih Cipendawa Motor?
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Kami tidak hanya memperbaiki kendaraan, kami membangun kepercayaan
            yang telah terbukti selama hampir 5 dekade.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-navy-light border border-white/10 rounded-xl p-6 hover:border-lime/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center text-lime mb-4 group-hover:bg-lime group-hover:text-navy