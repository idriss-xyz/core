import { TopBar } from '@/components';

import { Providers } from './providers';
import { ContentManager } from './content-manager';

export default function Claim() {
  return (
    <Providers>
      <TopBar />
      <ContentManager />
    </Providers>
  );
}
