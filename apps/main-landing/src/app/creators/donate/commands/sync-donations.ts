import { useMutation } from '@tanstack/react-query';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

const syncDonations = async () => {
  const response = await fetch(`${CREATOR_API_URL}/tip-history/sync`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to sync donations');
  }

  return response;
};

export const useSyncDonations = () => {
  return useMutation({
    mutationFn: syncDonations,
  });
};
