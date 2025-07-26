'use client';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import Content from './content';
import { OAuthCallbackHandler } from './components/oauth-callback-handler';

// ts-unused-exports:disable-next-line
export default function Landing() {
  return (
    <div className="relative flex h-screen">
      <OAuthCallbackHandler />
      <ScrollArea
        type="always"
        customScrollEventName="creatorsLandingPageScroll"
        className="[&_[data-radix-scroll-area-content]]:w-screen [&_[data-radix-scroll-area-content]]:min-w-[unset_!important]"
      >
        <Content />
      </ScrollArea>
    </div>
  );
}
