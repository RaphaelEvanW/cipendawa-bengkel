import Hero from "@/components/layout/Hero";
import WhyUsSection from "@/components/layout/WhyUsSection";
import ServiceSection from "@/components/layout/ServiceSection";
import AboutSection from "@/components/layout/AboutSection";
import TestimonialSection from "@/components/layout/TestimonialSection";
import LocationSection from "@/components/layout/LocationSection";
import CTASection from "@/components/layout/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyUsSection />
      <ServiceSection />
      <AboutSection />
      <TestimonialSection />
      <LocationSection />
      <CTASection />
    </>
  );
}