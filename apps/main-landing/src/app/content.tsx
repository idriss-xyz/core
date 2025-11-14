'use client';
import { useRef, useEffect, useState } from 'react';

import { CreatorProfileResponse } from '@/app/utils/types';

import { TopBar } from './components/top-bar';
import { PlatformsSection } from './components/platforms-section';
import { HeroSection } from './components/hero-section';
import { ProsSection } from './components/pros-section';
import { SetUp } from './components/set-up';
import { TopCreators } from './components/top-creators';
import { Footer } from './components/footer';
import { NftSection } from './components/nft-section';
import { getCookie } from './cookies';

type ContentProperties = { creator?: CreatorProfileResponse | null };

// ts-unused-exports:disable-next-line
export default function Content({ creator }: ContentProperties) {
  const heroButtonReference = useRef<HTMLButtonElement>(null);
  const [referrerName, setReferrerName] = useState<string | null>(
    creator?.name ?? null,
  );
  const [referrerProfilePictureUrl, setReferrerProfilePictureUrl] = useState<
    string | null
  >(creator?.profilePictureUrl ?? null);

  useEffect(() => {
    // If no creator from SSR, check cookie on client
    if (!creator) {
      const name = getCookie('referrerName');
      const pfp = getCookie('referrerProfilePictureUrl');
      if (name) setReferrerName(name);
      if (pfp) setReferrerProfilePictureUrl(pfp);
    }
  }, [creator]);

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
