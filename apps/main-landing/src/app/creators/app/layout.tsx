'use client';

import { usePathname } from 'next/navigation';
import { BreadcrumbNavigation } from '@idriss-xyz/ui/breadcrumb';

import { Providers } from '../providers';
import { siteMap } from '../constants';

import { Sidebar } from './sidebar';
import { TopBar } from './topbar';

// ts-unused-exports:disable-next-line
export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Providers>
      <div className="flex min-h-screen bg-neutral-100">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <TopBar />
          {/* Page Content */}
          <main className="p-2">
            <BreadcrumbNavigation pathname={pathname} siteMap={siteMap} />
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
