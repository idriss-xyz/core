import { useState, useEffect, useRef } from 'react';

import { getTextToSfx, getTextToSpeech } from '../utils';

const DONATION_TTS_MIN_AMOUNT = 4.75; // $5 minus 5% margin for price drops
const DONATION_TTS_DELAY = 2000;

export const useDonationNotification = (
  audio: HTMLAudioElement,
  amount: string,
  message: string,
  duration: number,
  sfxText?: string,
) => {
  const [showNotification, setShowNotification] = useState(false);
  const hasRunReference = useRef(false);

  useEffect(() => {
    if (!amount || hasRunReference.current) return;

    hasRunReference.current = true;
    sfxText
    ? getTextToSfx(sfxText)
        .then(async (stream) => {
          if (stream) {
            const arrayBuffer = await stream.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(blob);

            const speech = new Audio(audioUrl);
            speech.play().catch((error) => {
              console.error('Sfx audio playback failed:', error);
            });
          } else {
            throw new Error('Audio stream from api is null');
          }
        })
        .catch((error) => {
          console.error('Error fetching tts sound stream:', error);
        })
    :
    audio.play().catch((error) => {
      console.error('Alert audio playback failed:', error);
    });

    if (Number.parseFloat(amount) > DONATION_TTS_MIN_AMOUNT) {
      getTextToSpeech(message)
        .then(async (stream) => {
          if (stream) {
            const arrayBuffer = await stream.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(blob);

            const speech = new Audio(audioUrl);
            setTimeout(() => {
              speech.play().catch((error) => {
                console.error('TTS audio playback failed:', error);
              });
            }, DONATION_TTS_DELAY);
          } else {
            throw new Error('Audio stream from api is null');
          }
        })
        .catch((error) => {
          console.error('Error fetching tts sound stream:', error);
        });

      setShowNotification(true);

      const timeout = setTimeout(() => {
        setShowNotification(false);
        hasRunReference.current = false;
      }, duration);

      return () => {
        return clearTimeout(timeout);
      };
    }

    return () => {
      setShowNotification(false);
    };
  }, [amount, audio, duration, message]);

  return { showNotification };
};
