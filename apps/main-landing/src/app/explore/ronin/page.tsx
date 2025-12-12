import HubPage, { HubTheme } from '../common/hub-page';
import type { HubStreamer } from '../types';

import RONIN_BANNER from './banner.png';
import data from './data.json';

const theme: HubTheme = {
  radialBg:
    'bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)]',
  filterBorder: 'border-blue-400',
  filterText: 'text-neutralGreen-900',
  filterActiveBorder: 'border-neutralGreen-900',
  filterActiveBg: 'bg-blue-400',
  cardTheme: {
    backgroundClass: 'bg-white',
    followersTextClass: 'text-neutralGreen-900',
    donateButtonIntent: 'primary',
    colorScheme: 'blue',
    featuredBackgroundClass:
      'bg-[linear-gradient(135deg,_#004DE5_0%,_#002B7F_100%)]',
    featuredNameTextClass:
      'text-transparent bg-clip-text bg-[linear-gradient(90deg,_#FFFFFF_0%,_#004DE5_100%)]',
  },
};

// ts-unused-exports:disable-next-line
export default function RoninHub() {
  return (
    <HubPage
      title="Ronin Creators"
      bannerImage={RONIN_BANNER.src}
      groups={data as HubStreamer[]}
      theme={theme}
    />
  );
}
