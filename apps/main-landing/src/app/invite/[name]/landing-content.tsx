'use client';
import { useEffect } from 'react';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { OAuthCallbackHandler } from '@/app/components/oauth-callback-handler';
import Content from '@/app/content';
import { CreatorProfileResponse } from '@/app/utils/types';

type LandingContentProperties = {
  creator: CreatorProfileResponse;
};

const LandingContent = ({ creator }: LandingContentProperties) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('referrerName', creator.name);
      sessionStorage.setItem('referrerAddress', creator.address);
      sessionStorage.setItem(
        'referrerProfilePictureUrl',
        creator.profilePictureUrl ?? '',
      );
    }
  }, [creator]);

  return (
    <div className="relative flex h-screen">
      <OAuthCallbackHandler />
      <ScrollArea
        type="always"
        customScrollEventName="creatorsLandingPageScroll"
        className="[&_[data-radix-scroll-area-content]]:w-screen [&_[data-radix-scroll-area-content]]:min-w-[unset_!important]"
      >
        <Content creator={creator} />
      </ScrollArea>
    </div>
  );
};

export default LandingContent;
