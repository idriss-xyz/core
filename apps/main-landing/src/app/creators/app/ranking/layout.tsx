'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TabsPill, TabItem } from '@idriss-xyz/ui/tabs-pill';

// ts-unused-exports:disable-next-line
export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const rankingTabs: TabItem[] = [
    {
      name: 'Top creators',
      href: '/creators/app/ranking/top-creators',
      iconName: 'Gamepad2',
      isActive:
        pathname === '/creators/app/ranking/top-creators'
    },
    {
      name: 'Top donors',
      href: '/creators/app/ranking/top-donors',
      iconName: 'Trophy',
      isActive: pathname === '/creators/app/ranking/top-donors',
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
        <h1 className="text-heading3">Ranking</h1>
        <TabsPill tabs={rankingTabs} renderLink={renderLink} />
      </div>
      {children}
    </div>
  );
}
