import { TopBar } from '@/components';
import { backgroundLines2, backgroundLines3 } from '@/assets';

import { Providers } from '../providers';

import { CreatorProfileForm } from './form';

// ts-unused-exports:disable-next-line
export default function CreatorProfile() {
  return (
    <Providers>
      <TopBar />

      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          alt=""
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
        />

        <div className="mt-8 w-[440px] max-w-full overflow-hidden px-safe lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
          <div className="container relative flex w-full flex-col items-center rounded-xl bg-white px-4 pb-3 pt-6">
            <link rel="preload" as="image" href={backgroundLines3.src} />
            <img
              alt=""
              src={backgroundLines3.src}
              className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
            />

            <h1 className="self-start text-heading4">
              Create your donation link
            </h1>

            <div className="w-full">
              <CreatorProfileForm />
            </div>
          </div>
        </div>
      </main>
    </Providers>
  );
}
