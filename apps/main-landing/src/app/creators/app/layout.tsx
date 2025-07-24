'use client';

import { usePathname } from 'next/navigation';
import { BreadcrumbNavigation } from '@idriss-xyz/ui/breadcrumb';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { Providers } from '../providers';
import { siteMap } from '../constants';
import { OAuthCallbackHandler } from '../components/oauth-callback-handler';

import { CreatorSocketManager } from './creator-socket-manager';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import { useAuth } from '../context/auth-context';

// ts-unused-exports:disable-next-line
export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { creator } = useAuth();

  return (
    <Providers>
      <CreatorSocketManager />
      <div className="flex h-screen bg-neutral-100">
        <Sidebar />

        {/* Main Content */}
        <OAuthCallbackHandler />
        <div className="flex w-full flex-col">
          <TopBar />
          {/* Page Content */}
          <main className="flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="h-full px-3">
              {creator && (
                <BreadcrumbNavigation pathname={pathname} siteMap={siteMap} />
              )}
              {children}
            </ScrollArea>
          </main>
        </div>
      </div>
    </Providers>
  );
}
