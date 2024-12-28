import { useState, useEffect } from 'react';

export const useDonationNotification = (
   audio: HTMLAudioElement,
   amount: string,
   duration: number
) => {
   const [showNotification, setShowNotification] = useState(false);

   useEffect(() => {
      if (amount) {
         audio.play().catch((error) => {
            console.error('Audio playback failed:', error);
         });

         setShowNotification(true);

         const timeout = setTimeout(() => {
            setShowNotification(false);
         }, duration);

         return () => {return clearTimeout(timeout)};
      }

      return () => {
         setShowNotification(false);
      };
   }, [amount, audio, duration]);

   return { showNotification };
};
