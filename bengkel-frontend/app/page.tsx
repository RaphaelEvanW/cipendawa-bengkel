import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import WhyUsSection from "@/components/layout/WhyUsSection";
import ServiceSection from "@/components/layout/ServiceSection";
import AboutSection from "@/components/layout/AboutSection";
import TestimonialSection from "@/components/layout/TestimonialSection";
import LocationSection from "@/components/layout/LocationSection";
import CTASection from "@/components/layout/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Hero />
        <WhyUsSection />
        <ServiceSection />
        <AboutSection />
        <TestimonialSection />
        <LocationSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}