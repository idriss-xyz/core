import { Setting } from './components';
import { SETTING_NAME_TO_LABEL } from './constants';

export const OtherSettings = () => {
  return (
    <div>
      <Setting
        label={SETTING_NAME_TO_LABEL['entire-extension-enabled']}
        action={<Setting.Switch name="entire-extension-enabled" />}
      />
    </div>
  );
};
