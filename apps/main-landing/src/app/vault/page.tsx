import { Metadata } from 'next';
import { MobileNotSupported } from '@idriss-xyz/ui/mobile-not-supported';

import { IDRISS_SCENE_STREAM } from '@/assets';
import { TopBar } from '@/components';

import { Providers } from './providers';
import { VaultContent } from './content';

// ts-unused-exports:disable-next-line
export const metadata: Metadata = {
  description: 'IDRISS Vault',
  robots: {
    index: false,
    follow: false,
  },
};

// ts-unused-exports:disable-next-line
export default function Vault() {
  return (
    <Providers>
      <TopBar />
      <VaultContent />
      <MobileNotSupported
        className="bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)]"
        backgroundImage={
          <img
            alt=""
            src={IDRISS_SCENE_STREAM.src}
            className="pointer-events-none absolute left-[-310px] top-[120px] z-1 h-[770px] w-[1233.px] min-w-[120vw] max-w-none rotate-[25.903deg]"
          />
        }
      >
        <p className="text-balance text-center text-heading5 text-neutralGreen-700">
          Vault experience is designed for desktop.
        </p>

        <p className="text-balance text-center text-heading5 text-neutralGreen-700">
          Please use a PC or a laptop.
        </p>
      </MobileNotSupported>{' '}
    </Providers>
  );
}
