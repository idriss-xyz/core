import { TopBar } from '@/components';

import { Providers } from './providers';
import { ContentManager } from './content-manager';

// ts-unused-exports:disable-next-line
export default function Claim() {
  return (
    <Providers>
      <TopBar />
      <ContentManager />
    </Providers>
  );
}
