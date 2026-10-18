import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import ServiceSection from "@/components/layout/ServiceSection";
import AboutSection from "@/components/layout/AboutSection";
import TestimonialSection from "@/components/layout/TestimonialSection";
import LocationSection from "@/components/layout/LocationSection";
import CTASection from "@/components/layout/CTASection";
import InstagramSection from "@/components/layout/InstagramSection";

export default function HomePage() {
  return (
    <div id="beranda" className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Hero />
        <AboutSection />
        <InstagramSection />
        <ServiceSection />
        <TestimonialSection />
        <LocationSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
