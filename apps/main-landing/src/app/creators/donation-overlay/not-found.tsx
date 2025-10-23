import { Button } from '@idriss-xyz/ui/button';

import { TopBar } from '../components/top-bar';

// ts-unused-exports:disable-next-line
export default function NotFound() {
  return (
    <>
      <TopBar />
      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <div className="flex h-[80vh] flex-col items-center justify-center gap-3">
          <h1 className="text-display2 uppercase text-neutral-900">
            Page Not Found
          </h1>
          <span className="text-body2">
            This page you are looking for does not exist or has been moved.
          </span>
          <Button intent="primary" size="medium" asLink href="/">
            Go to homepage
          </Button>
        </div>
      </main>
    </>
  );
}
