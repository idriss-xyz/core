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
      href: '/app/earnings/stats-and-history',
      iconName: 'LineChart',
      isActive: pathname === '/app/earnings/stats-and-history',
    },
    {
      name: 'Balance',
      href: '/app/earnings/balance',
      iconName: 'Wallet',
      isActive: pathname === '/app/earnings/balance',
    },
    {
      name: 'Fans',
      href: '/app/earnings/fans',
      iconName: 'Users2',
      isActive: pathname === '/app/earnings/fans',
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
