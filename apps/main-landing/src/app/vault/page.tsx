import { TopBar } from '@/components';

import { Providers } from './providers';
import { VaultContent } from './content';

// ts-unused-exports:disable-next-line
export default function Vault() {
  return (
    <Providers>
      <TopBar />
      <VaultContent />
    </Providers>
  );
}
