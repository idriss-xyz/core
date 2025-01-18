import { Icon } from '@idriss-xyz/ui/icon';
import { useState, useEffect } from 'react';

export const SoundToggle = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    const lsEnableSoundValue = localStorage.getItem(
      'idriss-widget-enable-sound',
    );

    if (lsEnableSoundValue) {
      setIsSoundEnabled(!!lsEnableSoundValue);
    }
  }, []);

  const toggleSound = () => {
    const newToggleSoundValue = !isSoundEnabled;

    setIsSoundEnabled(newToggleSoundValue);

    localStorage.setItem(
      'idriss-widget-enable-sound',
      JSON.stringify(newToggleSoundValue),
    );
  };

  return (
    <span onClick={toggleSound} className="cursor-pointer">
      <Icon
        size={24}
        name={isSoundEnabled ? 'SoundEnabled' : 'SoundDisabled'}
      />
    </span>
  );
};
