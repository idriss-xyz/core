'use client';
import { useEffect, useRef, useState } from 'react';

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
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [referrerProfilePictureUrl, setReferrerProfilePictureUrl] = useState<
    string | null
  >(null);

  useEffect(() => {
    setReferrerName(sessionStorage.getItem('referrerName'));
    setReferrerProfilePictureUrl(
      sessionStorage.getItem('referrerProfilePictureUrl'),
    );
  }, []);

  return (
    <div className="relative">
      <TopBar
        isLanding
        displayCTA
        hideNavigation
        heroButtonReference={heroButtonReference}
        referrerName={referrerName}
        referrerProfilePictureUrl={referrerProfilePictureUrl}
      />

      <main>
        <HeroSection
          heroButtonReference={heroButtonReference}
          referrerName={referrerName}
        />
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
