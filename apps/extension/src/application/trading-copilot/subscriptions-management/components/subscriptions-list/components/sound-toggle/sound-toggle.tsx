import { Icon } from '@idriss-xyz/ui/icon';

import { useTradingCopilot } from 'shared/extension';

export const SoundToggle = () => {
  const { toastSoundEnabled, saveToastSoundState } = useTradingCopilot();

  const toggleSound = () => {
    saveToastSoundState(!toastSoundEnabled);
  };

  return (
    <span onClick={toggleSound} className="cursor-pointer">
      <Icon
        size={24}
        name={toastSoundEnabled ? 'SoundEnabled' : 'SoundDisabled'}
        className={toastSoundEnabled ? 'text-mint-500' : 'text-gray-300'}
      />
    </span>
  );
};
