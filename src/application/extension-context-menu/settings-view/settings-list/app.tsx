import { Icon, IconButton } from 'shared/ui';

import { SettingsView } from '../types';

interface SettingsListProperties {
  setCurrentView: (view: SettingsView) => void;
}
export const App = ({ setCurrentView }: SettingsListProperties) => {
  return (
    <div className="shrink-0 grow text-black">
      <div
        className="flex shrink-0 grow cursor-pointer items-center space-x-2 whitespace-nowrap py-3 text-base hover:text-green-500"
        onClick={() => {
          setCurrentView('customization');
        }}
      >
        <Icon name="GearIcon" size={20} />
        <span>Customization </span>
        <IconButton
          className="absolute right-6"
          iconProps={{ name: 'ChevronRightIcon', size: 25 }}
          onClick={() => {
            setCurrentView('settings');
          }}
        />
      </div>
      <div className="flex cursor-pointer items-center space-x-2 whitespace-nowrap py-3 text-base hover:text-green-500">
        <Icon name="ChatBubbleIcon" size={20} />
        <a
          href="https://www.idriss.xyz/discord"
          target="_blank"
          rel="noreferrer"
        >
          Support
        </a>
      </div>
    </div>
  );
};
