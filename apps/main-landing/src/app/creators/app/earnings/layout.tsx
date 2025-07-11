'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@idriss-xyz/ui/icon';
import { TabsPill, TabItem } from '@idriss-xyz/ui/tabs-pill';

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
      href: '/creators/app/earnings',
      iconName: 'LineChart',
      isActive: pathname === '/creators/app/earnings',
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
  }) => <Link href={href}>{children}</Link>;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="flex gap-2.5">
              <span className="max-h-[48px] min-h-4.5 min-w-[46px] max-w-[76px] text-body6 text-neutral-800">
                Earnings
              </span>
            </div>
            <div className="size-[16px] max-h-[46px] min-h-[16px] min-w-[16px] max-w-[46px]">
              <Icon name="IdrissArrowRight" size={16} className="text-black" />
            </div>

            <div className="flex gap-2.5">
              <span className="h-4.5 max-h-[48px] min-h-4.5 w-[79px] min-w-[79px] max-w-[109px] text-body6 text-neutral-800">
                Stats & history
              </span>
            </div>
          </div>

          <div className="flex gap-2.5">
            <div className="flex h-[40px] max-h-[70px] min-h-[40px] w-[213px] min-w-[213px] max-w-[243px] items-center">
              <h1 className="col-span-3 my-4 text-heading3">Earnings</h1>
            </div>
          </div>
        </div>

        <TabsPill tabs={earningsTabs} renderLink={renderLink} />
      </div>
      {children}
    </div>
  );
}
