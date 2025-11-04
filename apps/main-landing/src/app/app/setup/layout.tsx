'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TabsPill, TabItem } from '@idriss-xyz/ui/tabs-pill';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { useEffect, useState } from 'react';

import { CopyInput } from '../../components/copy-input/copy-input';
import { useAuth } from '../../context/auth-context';

// ts-unused-exports:disable-next-line
export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { creator } = useAuth();
  const [hasVisitedStreamAlerts, setHasVisitedStreamAlerts] = useState(false);

  useEffect(() => {
    const visitedKey = 'idriss-visited-stream-alerts';
    const hasVisited = localStorage.getItem(visitedKey) === 'true';
    setHasVisitedStreamAlerts(hasVisited);

    // If currently on stream alerts page and hasn't been marked as visited, mark it
    if (pathname === '/app/setup/stream-alerts' && !hasVisited) {
      localStorage.setItem(visitedKey, 'true');
      setHasVisitedStreamAlerts(true);
    }
  }, [pathname]);
  const setupTabs: TabItem[] = [
    {
      name: 'Payment methods',
      href: '/app/setup/payment-methods',
      iconName: 'HandCoins',
      isActive: pathname === '/app/setup/payment-methods',
    },
    {
      name: 'Stream alerts',
      href: '/app/setup/stream-alerts',
      iconName: 'BellRing',
      isActive: pathname === '/app/setup/stream-alerts',
      showPulsingDot: !hasVisitedStreamAlerts,
    },
    {
      name: 'Donation panel',
      href: '/app/setup/donation-panel',
      iconName: 'GalleryVertical',
      isActive: pathname === '/app/setup/donation-panel',
    },
    {
      name: 'Goals',
      href: '/app/setup/goals',
      iconName: 'Goal',
      isActive: pathname === '/app/setup/goals',
    },
    {
      name: 'Page customization',
      subtitle: 'Coming soon',
      iconName: 'Paintbrush',
      isActive: pathname === '/app/setup/page-customization',
      disabled: true,
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
    <div className="flex size-full flex-col gap-4">
      <h1 className="col-span-3 text-heading3">Setup</h1>
      <div className="relative flex flex-row items-center gap-4 rounded-lg bg-white/80 p-4">
        <GradientBorder
          gradientDirection="toRight"
          borderRadius={8}
          gradientStopColor="#E8FCE3"
        />
        <span className="mr-3 text-heading5">Your donation page</span>
        <CopyInput value={`${creator?.donationUrl}`} openExternal />
      </div>
      <TabsPill tabs={setupTabs} renderLink={renderLink} />
      {children}
    </div>
  );
}
