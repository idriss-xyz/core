import { useState, useEffect, useRef } from 'react';
import { getTextToSpeech } from '../utils';

export const useDonationNotification = (
  audio: HTMLAudioElement,
  amount: string,
  message: string,
  duration: number,
) => {
  const [showNotification, setShowNotification] = useState(false);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!amount || hasRunRef.current) return;

    hasRunRef.current = true;
    audio.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });

    if (parseFloat(amount) > 5) {
      getTextToSpeech(message)
        .then(async (stream) => {
          if (stream) {
            const arrayBuffer = await stream.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(blob);

            const speech = new Audio(audioUrl);
            setTimeout(() => {
              speech.play().catch((error) => {
                console.error('Audio playback failed:', error);
              });
            }, 2000);
          } else {
            throw new Error('Audio stream from api is null');
          }
        })
        .catch((error) => {
          console.error('Error fetching superdonation stream:', error);
        });

      setShowNotification(true);

      const timeout = setTimeout(() => {
        setShowNotification(false);
        hasRunRef.current = false;
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
