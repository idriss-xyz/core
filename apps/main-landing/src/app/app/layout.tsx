'use client';

import { usePathname } from 'next/navigation';
import { BreadcrumbNavigation } from '@idriss-xyz/ui/breadcrumb';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { useEffect } from 'react';

import { siteMap } from '../constants';
import useRedirectIfNotAuthenticated from '../hooks/use-redirect-not-authenticated';
import { useAuth } from '../context/auth-context';

import { CreatorSocketManager } from './creator-socket-manager';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';

function Layout({ children }: { children: React.ReactNode }) {
  const { setIsLoading } = useAuth();
  const pathname = usePathname();
  useRedirectIfNotAuthenticated();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <>
      <CreatorSocketManager />
      <div className="flex h-screen bg-neutral-100">
        <Sidebar />

        {/* Main Content */}
        <div className="flex w-full flex-col">
          <TopBar />
          {/* Page Content */}
          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="px-3 py-2">
              <BreadcrumbNavigation pathname={pathname} siteMap={siteMap} />
            </div>
            <ScrollArea className="flex-1 px-3 pb-3">{children}</ScrollArea>
          </main>
        </div>
      </div>
    </>
  );
}

// ts-unused-exports:disable-next-line
export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
