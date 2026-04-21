import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import DashboardPreview from "@/components/landing/DashboardPreview";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Integrations from "@/components/landing/Integrations";
import Testimonial from "@/components/landing/Testimonial";
import Stats from "@/components/landing/Stats";
import Pricing from "@/components/landing/Pricing";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DashboardPreview />
        <Features />
        <HowItWorks />
        {/* <Integrations /> */}
        <Testimonial />
        <Stats />
        {/* <Pricing /> */}
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
