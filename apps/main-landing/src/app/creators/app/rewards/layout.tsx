'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TabsPill, TabItem } from '@idriss-xyz/ui/tabs-pill';

import InviteBanner from './banner';

// ts-unused-exports:disable-next-line
export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const rewardsTabs: TabItem[] = [
    {
      name: 'Invites',
      href: '/creators/app/rewards/invites',
      iconName: 'MailCheck',
      isActive: pathname === '/creators/app/rewards/invites',
    },
    {
      name: 'Partner rewards',
      href: '/creators/app/rewards/partner-rewards',
      iconName: 'Handshake',
      isActive: pathname === '/creators/app/rewards/partner-rewards',
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
    <div>
      <div className="mb-3 flex flex-col gap-4">
        <h1 className="text-heading3">Rewards</h1>
        <InviteBanner />
        <TabsPill tabs={rewardsTabs} renderLink={renderLink} />
      </div>
      {children}
    </div>
  );
}
