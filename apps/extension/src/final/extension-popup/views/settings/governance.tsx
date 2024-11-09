import { Setting } from './components';
import { SETTING_NAME_TO_LABEL } from './constants';

export const GovernanceSettings = () => {
  return (
    <div>
      <Setting
        label={SETTING_NAME_TO_LABEL['agora-enabled']}
        action={<Setting.Switch name="agora-enabled" />}
      />

      <Setting
        label={SETTING_NAME_TO_LABEL['tally-enabled']}
        action={<Setting.Switch name="tally-enabled" />}
      />

      <Setting
        label={SETTING_NAME_TO_LABEL['snapshot-enabled']}
        action={<Setting.Switch name="snapshot-enabled" />}
      />
    </div>
  );
};
