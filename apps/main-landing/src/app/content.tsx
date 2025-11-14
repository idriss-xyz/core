'use client';
import { useRef } from 'react';

import { CreatorProfileResponse } from '@/app/utils/types';

import { TopBar } from './components/top-bar';
import { PlatformsSection } from './components/platforms-section';
import { HeroSection } from './components/hero-section';
import { ProsSection } from './components/pros-section';
import { SetUp } from './components/set-up';
import { TopCreators } from './components/top-creators';
import { Footer } from './components/footer';
import { NftSection } from './components/nft-section';

type ContentProperties = { creator?: CreatorProfileResponse | null };

// ts-unused-exports:disable-next-line
export default function Content({ creator }: ContentProperties) {
  const heroButtonReference = useRef<HTMLButtonElement>(null);
  const referrerName = creator?.name ?? null;
  const referrerProfilePictureUrl = creator?.profilePictureUrl ?? null;

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
