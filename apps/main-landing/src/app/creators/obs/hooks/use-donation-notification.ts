import { useState, useEffect } from 'react';
import { getTextToSpeech } from '../utils';

export const useDonationNotification = (
  audio: HTMLAudioElement,
  amount: string,
  duration: number,
) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (amount) {
      audio.play().catch((error) => {
        console.error('Audio playback failed:', error);
      });

      if (parseFloat(amount) > 5) {
        console.log("fetching superdonation sound")
        const sound = getTextToSpeech("This is a test to see if this works").catch((error) => {
          console.error('Error fetching superdonation sound:', error);
        });
        console.log(sound)
      }

      setShowNotification(true);

      const timeout = setTimeout(() => {
        setShowNotification(false);
      }, duration);

      return () => {
        return clearTimeout(timeout);
      };
    }

    return () => {
      setShowNotification(false);
    };
  }, [amount, audio, duration]);

  return { showNotification };
};
