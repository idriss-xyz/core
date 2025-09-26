'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TabsPill, TabItem } from '@idriss-xyz/ui/tabs-pill';
import { classes } from '@idriss-xyz/ui/utils';

// ts-unused-exports:disable-next-line
export default function EarningsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const earningsTabs: TabItem[] = [
    {
      name: 'Stats & history',
      href: '/creators/app/earnings/stats-and-history',
      iconName: 'LineChart',
      isActive: pathname === '/creators/app/earnings/stats-and-history',
    },
    {
      name: 'Balance',
      href: '/creators/app/earnings/balance',
      iconName: 'Wallet',
      isActive: pathname === '/creators/app/earnings/balance',
    },
    {
      name: 'Fans',
      href: '/creators/app/earnings/fans',
      iconName: 'Users2',
      isActive: pathname === '/creators/app/earnings/fans',
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
        <h1 className={classes('text-heading3')}>Earnings</h1>
        <TabsPill tabs={earningsTabs} renderLink={renderLink} />
      </div>
      {children}
    </div>
  );
}
