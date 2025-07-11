'use client';

import { classes } from '@idriss-xyz/ui/utils';

import { IDRISS_ICON_CIRCLE } from '@/assets';

import { Providers } from '../providers';

import { Sidebar } from './sidebar';

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
          {/* Top Bar */}
          <header className="flex h-16 items-center justify-between px-2">
            <div className="ml-auto flex items-center gap-2">
              <div className="flex shrink-0 items-center justify-center">
                <img
                  src={IDRISS_ICON_CIRCLE.src}
                  alt="Logo"
                  className={classes('size-12 rounded-full')}
                />
              </div>
              <span className="text-sm font-medium">geoist_</span>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-2">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
