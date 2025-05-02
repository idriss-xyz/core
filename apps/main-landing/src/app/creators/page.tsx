import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { Metadata } from 'next';

import { metadata as landingMetadata } from '@/app/layout';

import Content from './content';

// ts-unused-exports:disable-next-line
export const metadata: Metadata = {
  ...landingMetadata,
  description:
    'Creator monetization app that helps you earn more with instant payouts and near-zero platform cuts.',
  openGraph: {
    title: 'Make more, grow faster, take control',
    description:
      'Creator monetization app that helps you earn more with instant payouts and near-zero platform cuts.',
    images: [
      {
        url: '/og-creators.png',
      },
    ],
  },
};

// ts-unused-exports:disable-next-line
export default function Landing() {
  return (
    <div className="relative flex h-screen">
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
