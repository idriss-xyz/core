'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TabsPill, TabItem } from '@idriss-xyz/ui/tabs-pill';
import { Card } from '@idriss-xyz/ui/card';

// ts-unused-exports:disable-next-line
export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const donationGoalsTabs: TabItem[] = [
    {
      name: 'Active',
      href: '/creators/app/setup/donation-goals/active',
      iconName: 'Goal',
      isActive: pathname === '/creators/app/setup/donation-goals/active',
    },
    {
      name: 'History',
      href: '/creators/app/setup/donation-goals/history',
      iconName: 'History',
      isActive: pathname === '/creators/app/setup/donation-goals/history',
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
    <Card className="w-full">
      <div className="mb-3 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h5 className="pb-1 text-heading5 text-neutralGreen-900">
            Donation goals
          </h5>
          <TabsPill tabs={donationGoalsTabs} renderLink={renderLink} />
        </div>
      </div>
      {children}
    </Card>
  );
}
