import { TopBar } from '@/components';

import { Providers } from './providers';
import { VaultContent } from './content';
import { MobileNotSupportedContent } from './components/mobile-not-supported';

// ts-unused-exports:disable-next-line
export default function Vault() {
  return (
    <Providers>
      <TopBar />
      <VaultContent />
      <MobileNotSupportedContent />
    </Providers>
  );
}
