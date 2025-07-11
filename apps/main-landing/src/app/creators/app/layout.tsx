'use client';

import { Providers } from '../providers';

import { Sidebar } from './sidebar';
import { TopBar } from './topbar';

// ts-unused-exports:disable-next-line
export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex min-h-screen bg-neutral-100">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <TopBar />
          {/* Page Content */}
          <main className="p-2">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
