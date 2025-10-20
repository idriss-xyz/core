import { useCallback } from 'react';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { useQueryClient } from '@tanstack/react-query';

export function useDonationCallback(sfx: string | undefined) {
  const queryClient = useQueryClient();

  return useCallback(
    async (txHash: string) => {
      // local helper: SFX side effect
      const sendDonationEffects = async () => {
        if (!sfx || !txHash) return;
        await fetch(`${CREATOR_API_URL}/donation-effects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sfxMessage: sfx, txHash }),
        });
      };

      await sendDonationEffects();
      void queryClient.invalidateQueries({
        queryKey: ['collectibles'],
      });
    },
    [sfx, queryClient],
  );
}
