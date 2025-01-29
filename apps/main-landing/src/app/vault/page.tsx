import { TopBar } from '@/components';

import { Providers } from './providers';
import { StakingContent } from './content';

// ts-unused-exports:disable-next-line
export default function Staking() {
  return (
    <Providers>
      <TopBar />
      <StakingContent />
    </Providers>
  );
}
