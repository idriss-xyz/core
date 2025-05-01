import { useState, useEffect, useRef } from 'react';

import { getTextToSfx, getTextToSpeech } from '../utils';

const DONATION_TTS_MIN_AMOUNT = 4.75; // $5 minus 5% margin for price drops
const DONATION_SFX_MIN_AMOUNT = 9.5; // $10 minus 5% margin for price drops
const DONATION_ALERT_MIN_AMOUNT = 0.95; // $1 minus 5% margin for price drops
const DONATION_TTS_DELAY = 2000;

const toAudioElement = async (stream: Response): Promise<HTMLAudioElement> => {
  const arrayBuffer = await stream.arrayBuffer();
  const blob = new Blob([arrayBuffer], {
    type: 'audio/mpeg',
  });
  const audioUrl = URL.createObjectURL(blob);

  return new Audio(audioUrl);
};

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
    if (Number.parseFloat(amount) > DONATION_ALERT_MIN_AMOUNT) {
      const playAudio = async () => {
        try {
          let alertAudio = null;
          let speechAudio = null;

          if (sfxText && Number.parseFloat(amount) > DONATION_SFX_MIN_AMOUNT) {
            const sfxStream = await getTextToSfx(sfxText);
            if (!sfxStream)
              throw new Error('SFX audio stream from api is null');
            const sfxSpeech = await toAudioElement(sfxStream);
            alertAudio = sfxSpeech;
          } else {
            alertAudio = audio;
          }

          if (Number.parseFloat(amount) > DONATION_TTS_MIN_AMOUNT) {
            const ttsStream = await getTextToSpeech(message);
            if (!ttsStream)
              throw new Error('TTS audio stream from api is null');
            speechAudio = await toAudioElement(ttsStream);
          }
          setShowNotification(true);

          // Play audio streams
          await alertAudio?.play();
          await new Promise((resolve) => {
            return setTimeout(resolve, DONATION_TTS_DELAY);
          });
          if (speechAudio) {
            await speechAudio.play();
            // Wait for speech audio to complete before starting the notification timeout
            await new Promise((resolve) => {
              speechAudio.addEventListener('ended', resolve);
            });
          }

          const timeout = setTimeout(() => {
            setShowNotification(false);
            hasRunReference.current = false;
          }, duration);

          return () => {
            return clearTimeout(timeout);
          };
        } catch (error) {
          console.error('Audio playback failed:', error);
          setShowNotification(false);
          hasRunReference.current = false;
          return;
        }
      };

      void playAudio();

      return () => {
        setShowNotification(false);
      };
    }
    return;
  }, [amount, audio, duration, message, sfxText]);
  return { showNotification };
};
