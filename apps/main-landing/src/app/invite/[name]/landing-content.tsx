/* eslint-disable unicorn/no-document-cookie */
'use client';
import { useEffect } from 'react';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { OAuthCallbackHandler } from '@/app/components/oauth-callback-handler';
import Content from '@/app/content';
import { CreatorProfileResponse } from '@/app/utils/types';
import { setCookie } from '@/app/cookies';

type LandingContentProperties = {
  creator: CreatorProfileResponse;
};

const LandingContent = ({ creator }: LandingContentProperties) => {
  useEffect(() => {
    if (!creator) return;
    setCookie('referrerName', creator.name, 7);
    setCookie('referrerAddress', creator.address, 7);
    setCookie('referrerProfilePictureUrl', creator.profilePictureUrl ?? '', 7);
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
