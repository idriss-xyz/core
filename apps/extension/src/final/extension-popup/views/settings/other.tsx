import { Setting } from './components';
import { SETTING_NAME_TO_LABEL } from './constants';

export const OtherSettings = () => {
  return (
    <div>
      <Setting
        label={SETTING_NAME_TO_LABEL['wallet-lookup-enabled']}
        action={<Setting.Switch name="wallet-lookup-enabled" />}
      />

      <Setting
        label={SETTING_NAME_TO_LABEL['gitcoin-enabled']}
        action={<Setting.Switch name="gitcoin-enabled" />}
      />
    </div>
  );
};
