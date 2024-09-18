import { useNavigate } from 'react-router-dom';

import {
  AGORA_LOGO,
  POLYMARKET_LOGO,
  SNAPSHOT_LOGO,
  TALLY_LOGO,
} from 'shared/web3';
import { IDRISS_ICON } from 'shared/idriss';
import { EXTENSION_POPUP_MENU_ROUTES } from 'shared/extension';

import { TRADING_COPILOT_LOGO } from '../constants';

import { SectionTile } from './components';

export const App = () => {
  const navigate = useNavigate();
  return (
    <div className="flex max-w-[570px] grow flex-col items-center bg-gray-100 px-1 pt-6">
      <header className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-bold text-black">
          Hello, it&apos;s your web3 copilot speaking
        </h1>
        <p className="text-sm text-gray-600">
          Explore the features below for your best experience
        </p>
      </header>

      <div className="grid w-full grid-cols-2 gap-4 px-4">
        <SectionTile
          href="https://x.com/IDriss_xyz/status/1729258820441170160"
          icons={[{ iconSrc: IDRISS_ICON, iconAlt: 'Tipping Icon' }]}
          title="Tipping Badges"
          subtitle="Send crypto on X and Farcaster"
        />

        <SectionTile
          href="https://x.com/IDriss_xyz/status/1761049574691819798"
          icons={[
            { iconSrc: AGORA_LOGO, iconAlt: 'Agora Logo' },
            { iconSrc: SNAPSHOT_LOGO, iconAlt: 'Snapshot Logo' },
            { iconSrc: TALLY_LOGO, iconAlt: 'Tally Logo' },
          ]}
          title="Governance Widgets"
          subtitle="Get reminders about active DAO votes"
        />

        <SectionTile
          href="https://x.com/IDriss_xyz/status/1780582103396266085"
          icons={[{ iconSrc: POLYMARKET_LOGO, iconAlt: 'Polymarket Logo' }]}
          title="Polymarket Widget"
          subtitle="Trade directly from your X feed"
        />

        <SectionTile
          icons={[{ iconSrc: TRADING_COPILOT_LOGO, iconAlt: 'Trading Icon' }]}
          title="Trading Copilot"
          subtitle="Coming soon"
          disabled
        />
      </div>

      <div className="mt-8">
        <button
          className="rounded-lg bg-[#11dd74] px-6 py-3 font-medium text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-[#11cc74]"
          onClick={() => {
            navigate(EXTENSION_POPUP_MENU_ROUTES.SETTINGS.CUSTOMIZATION);
          }}
        >
          Customize Your Experience
        </button>
      </div>
    </div>
  );
};
