import { TopBar } from '@/components';

import { Providers } from './providers';
import { DesktopContentManager } from './desktop-content-manager';
import { MobileNotSupportedContent } from './components/mobile-not-supported/mobile-not-supported-content';

// ts-unused-exports:disable-next-line
export default function Claim() {
  return (
    <Providers>
      <TopBar />
      <DesktopContentManager />
      <MobileNotSupportedContent />
    </Providers>
  );
}
