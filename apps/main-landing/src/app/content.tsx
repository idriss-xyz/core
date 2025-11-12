'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';

import { TopBar } from './components/top-bar';
import { PlatformsSection } from './components/platforms-section';
import { HeroSection } from './components/hero-section';
import { ProsSection } from './components/pros-section';
import { SetUp } from './components/set-up';
import { TopCreators } from './components/top-creators';
import { Footer } from './components/footer';
import { NftSection } from './components/nft-section';
import { Avatar } from './components/avatar/avatar';

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
      />

      {referrerName && (
        <div className="sticky inset-x-0 top-[72px] z-topBar mb-[-72px] w-full items-center bg-white px-safe">
          <div className="container flex max-h-12 items-center gap-x-1 py-1 sm:gap-x-2 lg:py-3">
            <Avatar src={referrerProfilePictureUrl ?? undefined} size={32} />
            <span className="flex text-label5 uppercase gradient-text">
              {referrerName}
              <Icon name="Send" className="mx-2 text-mint-600" size={16} />
              invites you to join!
            </span>
          </div>
        </div>
      )}

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
