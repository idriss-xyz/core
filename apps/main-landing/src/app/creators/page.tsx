import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { TopBar } from './components/top-bar';
import { PlatformsSection } from './components/platforms-section';
import { HeroSection } from './components/hero-section';
import { ProsSection } from './components/pros-section';
import { SetUp } from './components/set-up';
import { TopCreators } from './components/top-creators';
import { Footer } from './components/footer';

// ts-unused-exports:disable-next-line
export default function Landing() {
  return (
    <div className="relative flex h-screen">
      <ScrollArea
        type="always"
        customScrollEventName="creatorsLandingPageScroll"
        className="[&_[data-radix-scroll-area-content]]:w-screen [&_[data-radix-scroll-area-content]]:min-w-[unset_!important]"
      >
        <div className="relative">
          <TopBar hideNavigation displayCTA />

          <main>
            <HeroSection />
            <PlatformsSection />
            <ProsSection />
            <SetUp />
            <TopCreators />
          </main>

          <Footer />
        </div>
      </ScrollArea>
    </div>
  );
}
