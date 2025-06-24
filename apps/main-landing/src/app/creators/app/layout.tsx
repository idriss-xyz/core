'use client';

import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import Image from 'next/image';
import Link from 'next/link';

import { IDRISS_ICON_CIRCLE } from '@/assets';

export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside className="m-3 flex w-64 flex-col rounded-xl bg-white">
        <div className="p-8">
          <Image
            src="/idriss-dark-logo.svg"
            alt="Logo"
            width={120}
            height={40}
            className="mx-auto"
          />
        </div>
        <nav className="flex-1 p-4">
          <div className="space-y-2 uppercase">
            <Link
              href="/creators/app/setup"
              className="flex items-center rounded-lg px-4 py-2"
            >
              <Icon size={32} name="Settings" className="mr-3 size-5" />
              Setup
            </Link>
          </div>
        </nav>
      </aside>

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
  );
}
