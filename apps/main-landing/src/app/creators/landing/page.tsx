import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { TopBar, Footer } from '@/components';

import { SupportSection } from './components/support-section';
import { HeroSection } from './components/hero-section';
import { ProsSection } from './components/pros-section';

// ts-unused-exports:disable-next-line
export default function Landing() {
  return (
    <div className="relative flex h-screen">
      <ScrollArea
        type="always"
        className="[&_[data-radix-scroll-area-content]]:w-screen [&_[data-radix-scroll-area-content]]:min-w-[unset_!important]"
      >
        <div className="relative">
          <TopBar />
          <main>
            <HeroSection />
            <SupportSection />
            <ProsSection />
          </main>
          <Footer />
        </div>
      </ScrollArea>
    </div>
  );
}
