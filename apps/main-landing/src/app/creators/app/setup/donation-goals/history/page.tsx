'use client';
import { Card } from '@idriss-xyz/ui/card';
import { usePathname } from 'next/navigation';
import { TabItem, TabsPill } from '@idriss-xyz/ui/tabs-pill';
import Link from 'next/link';

import { useAuth } from '@/app/creators/context/auth-context';

import SkeletonSetup from '../../loading';
import { GoalHistory } from '../components/goal-history';

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

export default function GoalHistoryPage() {
  const { creatorLoading } = useAuth();
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

  if (creatorLoading) {
    return <SkeletonSetup />;
  }

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <h5 className="pb-1 text-heading5 text-neutralGreen-900">
            Donation goals
          </h5>
          <TabsPill tabs={donationGoalsTabs} renderLink={renderLink} />
        </div>
        <GoalHistory />
      </div>
    </Card>
  );
}
