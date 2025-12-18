'use client';

import { InteractiveBackground } from '@/components/interactive-background';
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingFeatures } from '@/components/landing/landing-features';
import { LandingFooter } from '@/components/landing/landing-footer';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Dynamic Background Elements */}
      <InteractiveBackground color="59, 130, 246" />
      <div className="top-0 right-0 -z-10 absolute bg-primary/20 opacity-50 blur-[120px] rounded-full w-[500px] h-[500px]" />
      <div className="bottom-0 left-0 -z-10 absolute bg-purple-500/20 opacity-50 blur-[120px] rounded-full w-[500px] h-[500px]" />

      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <main className="flex-1">
        <LandingHero />

        {/* Features / Steps Grid */}
        <LandingFeatures />
      </main>

      {/* Modern Footer */}
      <LandingFooter />
    </div>
  );
}
