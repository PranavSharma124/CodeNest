import Navbar from "@/components/Navbar";
import DashboardPreview from "@/features/landing/dashboardPreview/DashboardPreview";
import Hero from "@/features/landing/Hero";
import WhyChooseCodeNest from "@/features/landing/WhyChooseCodeNest/WhyCodeNest";
import OpenSource from "@/features/landing/OpenSource";
import Footer from "@/features/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <DashboardPreview />
      <WhyChooseCodeNest/>
      <OpenSource/>
      <Footer/>
    </>
  );
}
