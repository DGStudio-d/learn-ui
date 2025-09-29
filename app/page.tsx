"use client";

import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import LanguagesGrid from "@/components/landing/languages-grid";
import Testimonials from "@/components/landing/testimonials";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <LanguagesGrid />
      <Testimonials />
      <Footer />
    </main>
  );
}
