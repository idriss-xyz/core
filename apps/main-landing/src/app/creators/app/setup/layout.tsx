'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TabsPill, TabItem } from '@idriss-xyz/ui/tabs-pill';
import { CREATORS_LINK } from '@idriss-xyz/constants';
import { useEffect, useState } from 'react';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Input } from '@idriss-xyz/ui/input';
import { Icon } from '@idriss-xyz/ui/icon';

import { useAuth } from '../../context/auth-context';

const validateAndCopy = (copyFunction: () => Promise<void>) => {
  setTimeout(() => {
    void copyFunction();
  }, 0);
};

// ts-unused-exports:disable-next-line
export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [copiedDonationLink, setCopiedDonationLink] = useState(false);
  const { creator, creatorLoading } = useAuth();

  const setupTabs: TabItem[] = [
    {
      name: 'Stream alerts',
      href: '/creators/app/setup/stream-alerts',
      iconName: 'BellRing',
      isActive:
        pathname === '/creators/app/setup/stream-alerts' ||
        pathname === '/creators/app/setup',
    },
    {
      name: 'Donation panel',
      href: '/creators/app/setup/donation-panel',
      iconName: 'GalleryVertical',
      isActive: pathname === '/creators/app/setup/donation-panel',
    },
  ];

  const renderLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
  }) => {
    return <Link href={href}>{children}</Link>;
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const copyDonationLink = async () => {
    const donationURL = `${CREATORS_LINK}/${creator?.name}`;

    await navigator.clipboard.writeText(donationURL);

    try {
      await fetch('https://api.idriss.xyz/creators/links', {
        method: 'POST',
        body: JSON.stringify({ donationURL }),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      console.warn('Error saving creator link.');
    }

    setCopiedDonationLink(true);
  };

  useEffect(() => {
    if (copiedDonationLink) {
      setTimeout(() => {
        setCopiedDonationLink(false);
      }, 2000);
    }
  }, [copiedDonationLink]);

  return (
    <div className="mb-4 flex flex-col gap-4">
      <h1 className="col-span-3 text-heading3">Setup</h1>
      <div className="gap-4 relative flex flex-row items-center rounded-lg bg-white/80 p-4">
        <GradientBorder
          gradientDirection="toRight"
          borderRadius={8}
          gradientStopColor="#E8FCE3"
        />
        <span className="mr-3 text-heading5">Your donation page</span>
        <Input
          value={`${CREATORS_LINK}/${creator?.name}`}
          readOnly
          className="min-w-[380px] max-w-[500px]"
          suffixElement={
            <div
              className="flex h-full items-center py-[2px]"
              onClick={() => {
                return validateAndCopy(copyDonationLink);
              }}
            >
              <div className="mr-3 h-full border-l border-gray-200" />
              {copiedDonationLink ? (
                <Icon name="Check" size={15} />
              ) : (
                <Icon name="Copy" size={15} />
              )}
            </div>
          }
        />
      </div>

      <TabsPill tabs={setupTabs} renderLink={renderLink} />
      {children}
    </div>
  );
}
