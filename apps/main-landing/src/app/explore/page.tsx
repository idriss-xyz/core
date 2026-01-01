import { IDRISS_SCENE_STREAM_2 } from '@/assets';

import HubPage, { HubTheme } from './common/hub-page';
import type { HubStreamer } from './types';
import data from './data.json';

const theme: HubTheme = {
  radialBg:
    'bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)]',
  filterBorder: 'border-mint-400',
  filterText: 'text-neutralGreen-900',
  filterActiveBorder: 'border-neutralGreen-900',
  filterActiveBg: 'bg-neutralGreen-900',
  cardTheme: {
    borderClass: 'border-mint-400',
    backgroundClass: 'bg-white',
    followersTextClass: 'text-neutralGreen-900',
    donateButtonIntent: 'primary',
    donateButtonClass: 'w-full',
  },
};

// ts-unused-exports:disable-next-line
export default function GenericHub() {
  return (
    <HubPage
      title="Streamer Hub"
      bannerImage={IDRISS_SCENE_STREAM_2.src}
      groups={data as HubStreamer[]}
      theme={theme}
    />
  );
}
