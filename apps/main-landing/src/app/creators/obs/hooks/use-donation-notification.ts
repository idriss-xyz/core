import { useState, useEffect, useRef } from 'react';

import { getTextToSfx, getTextToSpeech } from '../utils';
import { MinimumAmounts } from '../page';

const PRICE_DROP_RANGE = 0.05;
const DONATION_TTS_DELAY = 2000;

const toAudioElement = async (stream: Response): Promise<HTMLAudioElement> => {
  const arrayBuffer = await stream.arrayBuffer();
  const blob = new Blob([arrayBuffer], {
    type: 'audio/mpeg',
  });
  const audioUrl = URL.createObjectURL(blob);

  return new Audio(audioUrl);
};

const priceDropCalculatedAmount = (amount: number) => {
  return amount - amount * PRICE_DROP_RANGE;
};

export const useDonationNotification = (
  audio: HTMLAudioElement,
  amount: string,
  minimumAmounts: MinimumAmounts,
  message: string,
  duration: number,
  sfxText?: string,
) => {
  const [showNotification, setShowNotification] = useState(false);
  const hasRunReference = useRef(false);
  const { minimumAlertAmount, minimumTTSAmount, minimumSfxAmount } =
    minimumAmounts;

  useEffect(() => {
    if (!amount || hasRunReference.current) return;

    hasRunReference.current = true;
    if (
      Number.parseFloat(amount) > priceDropCalculatedAmount(minimumAlertAmount)
    ) {
      const playAudio = async () => {
        try {
          let alertAudio = null;
          let speechAudio = null;

          if (
            sfxText &&
            Number.parseFloat(amount) >
              priceDropCalculatedAmount(minimumSfxAmount)
          ) {
            const sfxStream = await getTextToSfx(sfxText);
            if (!sfxStream)
              throw new Error('SFX audio stream from api is null');
            const sfxSpeech = await toAudioElement(sfxStream);
            alertAudio = sfxSpeech;
          } else {
            alertAudio = audio;
          }

          if (
            Number.parseFloat(amount) >
            priceDropCalculatedAmount(minimumTTSAmount)
          ) {
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
