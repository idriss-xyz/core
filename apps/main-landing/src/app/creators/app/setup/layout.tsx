'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TabsPill, TabItem } from '@idriss-xyz/ui/tabs-pill';
import { CREATORS_LINK } from '@idriss-xyz/constants';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import { useAuth } from '../../context/auth-context';
import { CopyInput } from '../../components/copy-input/copy-input';

// ts-unused-exports:disable-next-line
export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
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

  return (
    <div className="mb-4 flex size-full flex-col gap-4">
      <h1 className="col-span-3 text-heading3">Setup</h1>
      <div className="relative flex flex-row items-center gap-4 rounded-lg bg-white/80 p-4">
        <GradientBorder
          gradientDirection="toRight"
          borderRadius={8}
          gradientStopColor="#E8FCE3"
        />
        <span className="mr-3 text-heading5">Your donation page</span>
        <CopyInput value={`${CREATORS_LINK}/${creator?.name}`} />
      </div>

      <TabsPill tabs={setupTabs} renderLink={renderLink} />
      {children}
    </div>
  );
}
