import { useState } from 'react';

import { IconButton } from 'shared/ui';

import { SettingsList } from './settings-list';
import { CustomizationSettings } from './customization-settings';
import { SettingsView } from './types';

export const App = () => {
  const [currentView, setCurrentView] = useState<SettingsView>('list');

  return (
    <div className="shrink-0 grow px-6 pb-2 text-black">
      <div className="relative flex justify-center whitespace-nowrap px-5 py-4 text-lg font-bold">
        {currentView !== 'list' && (
          <IconButton
            className="absolute left-0 text-black"
            iconProps={{ name: 'ArrowLeftIcon', size: 25 }}
            onClick={() => {
              setCurrentView('list');
            }}
          />
        )}

        {currentView === 'customization' ? 'Customization' : 'Settings'}
      </div>
      {currentView === 'customization' ? (
        <CustomizationSettings />
      ) : (
        <SettingsList setCurrentView={setCurrentView} />
      )}
    </div>
  );
};
