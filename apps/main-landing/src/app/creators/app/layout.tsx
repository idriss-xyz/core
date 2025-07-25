'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BreadcrumbNavigation } from '@idriss-xyz/ui/breadcrumb';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

import { siteMap } from '../constants';
import { useAuth } from '../context/auth-context';

import { CreatorSocketManager } from './creator-socket-manager';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { creatorLoading, creator } = useAuth();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    console.log('Authenticated', authenticated);
    console.log('Ready', ready);
    console.log('CreatorLoading', creatorLoading);
    if (!ready || creatorLoading) {
      return;
    }
    if (!authenticated || !creator) {
      console.log('returning');
      router.replace('/creators');
    }
  }, [ready, authenticated, creatorLoading, router, creator]);

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
            <ScrollArea className="h-full px-3">
              <BreadcrumbNavigation pathname={pathname} siteMap={siteMap} />
              {children}
            </ScrollArea>
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
  return (
    <Layout>{children}</Layout>
  );
}
