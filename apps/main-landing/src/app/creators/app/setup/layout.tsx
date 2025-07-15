'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TabsPill, TabItem } from '@idriss-xyz/ui/tabs-pill';
import { Button } from '@idriss-xyz/ui/button';
import { CREATORS_LINK } from '@idriss-xyz/constants';
import { useEffect, useState } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

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
    <div>
      <div className="mb-4 flex flex-col gap-4">
        <h1 className="col-span-3 my-4 text-heading3">Setup</h1>

        <div className="rounded-lg border-2 border-mint-300 bg-white p-4">
          <span className="mr-3">Your donation page</span>
          <input
            className="mr-2 w-[320px] p-3"
            value={`${CREATORS_LINK}/${creator?.name}`}
            readOnly
          />
          <Button
            size="medium"
            intent="primary"
            onClick={() => {
              return validateAndCopy(copyDonationLink);
            }}
            prefixIconName={copiedDonationLink ? 'CheckCircle2' : undefined}
            className={classes(
              'inline w-fit',
              copiedDonationLink &&
                'bg-mint-600 hover:bg-mint-600 [&>div]:hidden',
            )}
          >
            {copiedDonationLink ? '' : 'COPY'}
          </Button>
        </div>

        <TabsPill tabs={setupTabs} renderLink={renderLink} />
      </div>
      {children}
    </div>
  );
}
