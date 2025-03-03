'use client';
import { Link } from '@idriss-xyz/ui/link';
import { Alert } from '@idriss-xyz/ui/alert';

import { TopBar } from '@/components';

import { Providers } from './providers';
import { DesktopContentManager } from './desktop-content-manager';
import { MobileNotSupportedContent } from './components/mobile-not-supported/mobile-not-supported-content';

// ts-unused-exports:disable-next-line
export default function Claim() {
  return (
    <Providers>
      <Alert
        type="default"
        className="z-alert absolute inset-x-0 top-2 mx-auto w-full max-w-[1200px]"
        heading="Claim open for appeal participants only"
        description="The regular claim ended on Feb 10. This claim is open only for those with a successful appeal."
        actionButtons={(close) => {
          return (
            <Link
              size="m"
              onClick={close}
              className="cursor-pointer border-none text-neutral-900"
            >
              Dismiss
            </Link>
          );
        }}
      />
      <TopBar />
      <DesktopContentManager />
      <MobileNotSupportedContent />
    </Providers>
  );
}
