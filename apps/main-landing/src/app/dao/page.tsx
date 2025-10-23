import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import {
  HeroSection,
  SuperpowersSection,
  ProductsSection,
  TokenSection,
  TopBar,
  Footer,
} from '@/components';

// ts-unused-exports:disable-next-line
export default function Home() {
  return (
    <div className="relative flex h-screen">
      <ScrollArea
        id="landing-page-scroll"
        type="always"
        customScrollEventName="landingPageScroll"
        className="[&_[data-radix-scroll-area-content]]:w-screen [&_[data-radix-scroll-area-content]]:min-w-[unset_!important]"
      >
        <div className="relative">
          <TopBar />
          <main>
            <HeroSection />
            <SuperpowersSection />
            <ProductsSection />
            <TokenSection />
          </main>
          <Footer />
        </div>
      </ScrollArea>
    </div>
  );
}
