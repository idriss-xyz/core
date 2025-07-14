'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BreadcrumbNavigation, SiteMapItem } from '@idriss-xyz/ui/breadcrumb';
import { TabsPill, TabItem } from '@idriss-xyz/ui/tabs-pill';

const siteMap: SiteMapItem[] = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Earnings',
    path: '/earnings',
    children: [
      {
        name: 'Stats & history',
        path: '/earnings/stats',
      },
      {
        name: 'Balance',
        path: '/earnings/balance',
      },
      {
        name: 'Top donors',
        path: '/earnings/top-donors',
      },
    ],
  },
  // TODO: Add more pages here and move to general layout
];

// ts-unused-exports:disable-next-line
export default function EarningsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const earningsTabs: TabItem[] = [
    {
      name: 'Balance',
      href: '/creators/app/earnings/balance',
      iconName: 'Wallet',
      isActive: pathname === '/creators/app/earnings/balance',
    },
    {
      name: 'Stats & history',
      href: '/creators/app/earnings/stats',
      iconName: 'LineChart',
      isActive:
        pathname === '/creators/app/earnings/stats' ||
        pathname === '/creators/app/earnings',
    },
    {
      name: 'Top donors',
      href: '/creators/app/earnings/top-donors',
      iconName: 'Trophy',
      isActive: pathname === '/creators/app/earnings/top-donors',
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
      <div className="mb-4 flex flex-col gap-4">
        <BreadcrumbNavigation
          pathname={pathname}
          siteMap={siteMap}
          basePath="/creators/app"
        />
        <h1 className="text-heading3">Earnings</h1>
        <TabsPill tabs={earningsTabs} renderLink={renderLink} />
      </div>
      {children}
    </div>
  );
}
