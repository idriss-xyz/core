import { useExtensionSettings } from 'shared/extension';
import { Checkbox } from 'shared/ui';

import {
  getSettingsGroupState,
  mapGroupSettingsStateToExtendedCheckbox,
} from './utils';

export const App = () => {
  const { changeExtensionSetting, extensionSettings } = useExtensionSettings();

  const transferSettings = [
    extensionSettings['tipping-enabled'],
    extensionSettings['gitcoin-enabled'],
  ];

  const transferSettingsState = getSettingsGroupState(transferSettings);

  const governanceSettings = [
    extensionSettings['snapshot-enabled'],
    extensionSettings['tally-enabled'],
    extensionSettings['agora-enabled'],
  ];
  const governanceSettingsState = getSettingsGroupState(governanceSettings);

  const tradingSettings = [extensionSettings['polymarket-enabled']];

  const tradingSettingsState = getSettingsGroupState(tradingSettings);

  const handleTransferGroupChange = (enabled: boolean) => {
    void changeExtensionSetting('tipping-enabled', enabled);
    void changeExtensionSetting('gitcoin-enabled', enabled);
  };

  const handleGovernanceGroupChange = (enabled: boolean) => {
    void changeExtensionSetting('snapshot-enabled', enabled);
    void changeExtensionSetting('tally-enabled', enabled);
    void changeExtensionSetting('agora-enabled', enabled);
  };

  const handleTradingGroupChange = (enabled: boolean) => {
    void changeExtensionSetting('polymarket-enabled', enabled);
  };

  return (
    <div className="max-h-[220px] shrink-0 grow overflow-y-auto pl-3 text-base text-black [scrollbar-color:gray_#efefef] [scrollbar-width:thin]">
      <div className="flex flex-row items-center space-x-2 pb-3 pt-2 font-bold">
        <Checkbox
          type="extended"
          value={mapGroupSettingsStateToExtendedCheckbox(transferSettingsState)}
          onChange={handleTransferGroupChange}
        />
        <span>Transfer</span>
      </div>
      <div className="flex flex-col pb-3">
        <div className="flex flex-row space-x-2 pb-3 pl-7">
          <Checkbox
            value={extensionSettings['tipping-enabled']}
            onChange={(enabled) => {
              return changeExtensionSetting('tipping-enabled', enabled);
            }}
          />
          <span>Tipping</span>
        </div>
        <div className="flex flex-row space-x-2 pb-3 pl-7">
          <Checkbox
            value={extensionSettings['gitcoin-enabled']}
            onChange={(enabled) => {
              return changeExtensionSetting('gitcoin-enabled', enabled);
            }}
          />
          <span>Gitcoin</span>
        </div>
      </div>

      <div className="flex flex-row items-center space-x-2 pb-3 pl-1 font-bold">
        <Checkbox
          value={mapGroupSettingsStateToExtendedCheckbox(
            governanceSettingsState,
          )}
          type="extended"
          onChange={handleGovernanceGroupChange}
        />
        <span>Governance</span>
      </div>
      <div className="flex flex-col pb-3">
        <div className="flex flex-row space-x-2 pb-3 pl-7">
          <Checkbox
            value={extensionSettings['snapshot-enabled']}
            onChange={(enabled) => {
              return changeExtensionSetting('snapshot-enabled', enabled);
            }}
          />
          <span>Snapshot</span>
        </div>
        <div className="flex flex-row space-x-2 pb-3 pl-7">
          <Checkbox
            value={extensionSettings['tally-enabled']}
            onChange={(enabled) => {
              return changeExtensionSetting('tally-enabled', enabled);
            }}
          />
          <span>Tally</span>
        </div>
        <div className="flex flex-row space-x-2 pb-3 pl-7">
          <Checkbox
            value={extensionSettings['agora-enabled']}
            onChange={(enabled) => {
              return changeExtensionSetting('agora-enabled', enabled);
            }}
          />
          <span>Agora</span>
        </div>
      </div>

      <div className="flex flex-row items-center space-x-2 pb-3 pl-1 font-bold">
        <Checkbox
          value={extensionSettings['polymarket-enabled']}
          onChange={handleTradingGroupChange}
        />
        <span>Trading</span>
      </div>
      <div className="flex items-center space-x-2 pb-3 pl-7">
        <Checkbox
          value={mapGroupSettingsStateToExtendedCheckbox(tradingSettingsState)}
          type="extended"
          onChange={(enabled) => {
            return changeExtensionSetting('polymarket-enabled', enabled);
          }}
        />
        <span>Polymarket</span>
      </div>
    </div>
  );
};
