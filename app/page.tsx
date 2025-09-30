//app/page.tsx
'use client';

import Footer from '@/components/footer';
import {
  HeroSection,
  StatsSection,
  FeaturesGrid,
  LabCards,
  HowItWorks,
  Testimonials,
} from '@/components/landingPage';

import '@/public/css/lufga.css';
import '@/public/css/clash-display.css';

export default function LandingPage() {
  return (
    <>
      <main className="min-h-screen flex flex-col text-white">
        <HeroSection />
        <StatsSection />
        <FeaturesGrid />
        <LabCards />
        <HowItWorks />
        <Testimonials />
        <Footer />
      </main>
    </>
  );
}
