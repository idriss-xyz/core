import { TopBar } from '@/components';

import { Providers } from './providers';
import { CheckEligibilityContent } from './content';

export default function CheckEligibility() {
  return (
    <Providers>
      <TopBar />
      <CheckEligibilityContent />
    </Providers>
  );
}
