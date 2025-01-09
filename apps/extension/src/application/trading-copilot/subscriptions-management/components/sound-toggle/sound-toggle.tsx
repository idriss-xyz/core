import { Icon } from '@idriss-xyz/ui/icon';
import { useState, useEffect } from 'react';

export const SoundToggle = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  useEffect(() => {
    const enableSound = localStorage.getItem('idriss-widget-enable-sound');
    setIsSoundEnabled(enableSound === 'true');
  }, []);

  const toggleSound = () => {
    const newSoundEnabled = !isSoundEnabled;
    setIsSoundEnabled(newSoundEnabled);
    localStorage.setItem('idriss-widget-enable-sound', String(newSoundEnabled));
  };

  return (
    <span onClick={toggleSound} className="cursor-pointer">
      {isSoundEnabled ? (
        <Icon name="SoundEnabled" size={24} />
      ) : (
        <Icon name="SoundDisabled" size={24} />
      )}
    </span>
  );
};
