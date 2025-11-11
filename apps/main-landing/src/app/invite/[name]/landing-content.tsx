'use client';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { OAuthCallbackHandler } from '@/app/components/oauth-callback-handler';
import Content from '@/app/content';
import { CreatorProfileResponse } from '@/app/utils/types';

type LandingContentProperties = {
  creator: CreatorProfileResponse;
};

const LandingContent = ({ creator }: LandingContentProperties) => {
  localStorage.setItem('referrerName', creator.name);
  localStorage.setItem('referrerAddress', creator.address);
  localStorage.setItem(
    'referrerProfilePictureUrl',
    creator.profilePictureUrl ?? '',
  );

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
};

export default LandingContent;
