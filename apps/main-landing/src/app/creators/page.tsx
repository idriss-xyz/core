'use client';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { useSearchParams } from 'next/navigation';

import Content from './content';
import { OAuthCallbackHandler } from './components/oauth-callback-handler';

// ts-unused-exports:disable-next-line
export default function Landing() {
  const searchParameters = useSearchParams();
  const customToken = searchParameters.get('token');

  return (
    <div className="relative flex h-screen">
      <OAuthCallbackHandler authToken={customToken} />
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
