'use client';
import { useRef } from 'react';

import { TopBar } from './components/top-bar';
import { PlatformsSection } from './components/platforms-section';
import { HeroSection } from './components/hero-section';
import { ProsSection } from './components/pros-section';
import { SetUp } from './components/set-up';
import { TopCreators } from './components/top-creators';
import { Footer } from './components/footer';
import { NftSection } from './components/nft-section';

// ts-unused-exports:disable-next-line
export default function Content() {
  const heroButtonReference = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <TopBar
        isLanding
        displayCTA
        hideNavigation
        heroButtonReference={heroButtonReference}
      />

      <main>
        <HeroSection heroButtonReference={heroButtonReference} />
        <PlatformsSection />
        <ProsSection />
        <NftSection />
        <SetUp />
        <TopCreators />
      </main>

      <Footer />
    </div>
  );
}
