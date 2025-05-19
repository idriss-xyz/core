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
  const audioElement = new Audio(audioUrl);

  const onEndedOrError = () => {
    audioElement.removeEventListener('ended', onEndedOrError);
    audioElement.removeEventListener('error', onEndedOrError);
    if (audioElement.src === audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };
  audioElement.addEventListener('ended', onEndedOrError);
  audioElement.addEventListener('error', onEndedOrError);

  return audioElement;
};

export const useDonationNotification = (
  audio: HTMLAudioElement,
  amount: string,
  message: string,
  sfxText: string | undefined,
  minOverallVisibleDuration: number, // Minimum total time the notification should be visible
  onFullyComplete: () => void, // Callback when the notification lifecycle is complete
) => {
  const [showNotification, setShowNotification] = useState(false);
  const hideTimeoutIdReference = useRef<NodeJS.Timeout | null>(null);
  const notificationVisibleStartTimeReference = useRef<number | null>(null);

  // Refs to store audio elements created by this hook for cleanup
  const sfxAudioElementReference = useRef<HTMLAudioElement | null>(null);
  const ttsAudioElementReference = useRef<HTMLAudioElement | null>(null);

  const didRunReference = useRef(false);

  useEffect(() => {
    if (didRunReference.current) return;
    didRunReference.current = true;
    // --- Start of Effect Cleanup (from previous run or on unmount) ---
    notificationVisibleStartTimeReference.current = null; // Reset on new effect run

    if (hideTimeoutIdReference.current) {
      clearTimeout(hideTimeoutIdReference.current);
      hideTimeoutIdReference.current = null;
    }

    // Stop all audio and clear memory
    if (sfxAudioElementReference.current) {
      sfxAudioElementReference.current.pause();
      if (sfxAudioElementReference.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(sfxAudioElementReference.current.src);
      }
      sfxAudioElementReference.current = null;
    }
    if (ttsAudioElementReference.current) {
      ttsAudioElementReference.current.pause();
      if (ttsAudioElementReference.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(ttsAudioElementReference.current.src);
      }
      ttsAudioElementReference.current = null;
    }
    // --- End of Effect Cleanup ---

    if (!amount || Number.parseFloat(amount) <= DONATION_ALERT_MIN_AMOUNT) {
      setShowNotification(false);
      onFullyComplete();
      return;
    }

    const processDonationAsync = async () => {
      const useSfx =
        sfxText && Number.parseFloat(amount) > DONATION_SFX_MIN_AMOUNT;
      const useTts = Number.parseFloat(amount) > DONATION_TTS_MIN_AMOUNT;

      let sfxAudioForPlayback: HTMLAudioElement | null = null;
      let ttsAudioForPlayback: HTMLAudioElement | null = null;

      try {
        if (useSfx) {
          const sfxStream = await getTextToSfx(sfxText);
          if (sfxStream) {
            sfxAudioElementReference.current = await toAudioElement(sfxStream);
            sfxAudioForPlayback = sfxAudioElementReference.current;
          } else {
            console.warn(
              'SFX audio stream from API was null. Default alert sound will be used if applicable.',
            );
          }
        }

        if (useTts) {
          const ttsStream = await getTextToSpeech(message);
          if (ttsStream) {
            ttsAudioElementReference.current = await toAudioElement(ttsStream);
            ttsAudioForPlayback = ttsAudioElementReference.current;
          } else {
            console.warn(
              'TTS audio stream from API was null. TTS will be skipped.',
            );
          }
        }

        notificationVisibleStartTimeReference.current = Date.now();
        setShowNotification(true);
        await new Promise((resolve) => {
          return requestAnimationFrame(resolve);
        });

        const playAndWait = async (audioElement: HTMLAudioElement | null) => {
          if (!audioElement) return;
          return new Promise<void>((resolvePromise) => {
            const onEnded = () => {
              cleanupAndResolve();
            };
            const onError = (event: Event | string) => {
              console.error(
                'Audio playback error:',
                event instanceof Event
                  ? (event.target as HTMLAudioElement)?.error
                  : event,
              );
              cleanupAndResolve();
            };
            const cleanupAndResolve = () => {
              audioElement.removeEventListener('ended', onEnded);
              audioElement.removeEventListener('error', onError);
              resolvePromise();
            };

            audioElement.addEventListener('ended', onEnded);
            audioElement.addEventListener('error', onError);

            audioElement.play().catch((playError) => {
              console.error('Audio element .play() call failed:', playError);
              cleanupAndResolve();
            });
          });
        };

        let alertSoundPlayed = false;
        if (sfxAudioForPlayback) {
          await playAndWait(sfxAudioForPlayback);
          alertSoundPlayed = true;
        } else {
          await playAndWait(audio);
          alertSoundPlayed = true;
        }

        if (ttsAudioForPlayback) {
          if (alertSoundPlayed) {
            await new Promise((resolve) => {
              return setTimeout(resolve, DONATION_TTS_DELAY);
            });
          }
          await playAndWait(ttsAudioForPlayback);
        }

        const audioFinishedTime = Date.now();
        let timeVisibleDuringAudio = 0;
        if (notificationVisibleStartTimeReference.current) {
          timeVisibleDuringAudio =
            audioFinishedTime - notificationVisibleStartTimeReference.current;
        }

        const remainingVisibleTimeForOverall = Math.max(
          0,
          minOverallVisibleDuration - timeVisibleDuringAudio,
        );
        const actualPostAudioTimeoutDuration = remainingVisibleTimeForOverall;

        if (hideTimeoutIdReference.current) {
          clearTimeout(hideTimeoutIdReference.current);
        }
        hideTimeoutIdReference.current = setTimeout(() => {
          setShowNotification(false);
          hideTimeoutIdReference.current = null;
          onFullyComplete();
        }, actualPostAudioTimeoutDuration);
      } catch (error) {
        console.error('Donation notification processing failed:', error);
        setShowNotification(false);

        if (sfxAudioElementReference.current) {
          sfxAudioElementReference.current.pause();
          if (sfxAudioElementReference.current.src.startsWith('blob:')) {
            URL.revokeObjectURL(sfxAudioElementReference.current.src);
          }
          sfxAudioElementReference.current = null;
        }
        if (ttsAudioElementReference.current) {
          ttsAudioElementReference.current.pause();
          if (ttsAudioElementReference.current.src.startsWith('blob:')) {
            URL.revokeObjectURL(ttsAudioElementReference.current.src);
          }
          ttsAudioElementReference.current = null;
        }
        if (hideTimeoutIdReference.current) {
          clearTimeout(hideTimeoutIdReference.current);
          hideTimeoutIdReference.current = null;
        }
        onFullyComplete();
      }
    };

    void processDonationAsync();

    return () => {
      if (hideTimeoutIdReference.current) {
        clearTimeout(hideTimeoutIdReference.current);
        hideTimeoutIdReference.current = null;
      }
      if (sfxAudioElementReference.current) {
        sfxAudioElementReference.current.pause();
        if (sfxAudioElementReference.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(sfxAudioElementReference.current.src);
        }
        sfxAudioElementReference.current = null;
      }
      if (ttsAudioElementReference.current) {
        ttsAudioElementReference.current.pause();
        if (ttsAudioElementReference.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(ttsAudioElementReference.current.src);
        }
        ttsAudioElementReference.current = null;
      }
    };
  }, [
    amount,
    message,
    sfxText,
    audio,
    minOverallVisibleDuration,
    onFullyComplete,
  ]);

  return { showNotification };
};
