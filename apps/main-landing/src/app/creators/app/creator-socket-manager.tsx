'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { default as io } from 'socket.io-client';
import { CREATOR_API_URL, StoredDonationData } from '@idriss-xyz/constants';

import { useAuth } from '../context/auth-context';

export const CreatorSocketManager = () => {
  const { creator, addDonation } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!creator?.primaryAddress) return;

    const socket = io(CREATOR_API_URL);

    socket.on('connect', () => {
      socket.emit('register', creator.primaryAddress);
    });

    socket.on('newDonation', (donation: StoredDonationData) => {
      addDonation(donation);
      void queryClient.invalidateQueries({
        queryKey: ['balances', creator.primaryAddress],
      });
      void queryClient.invalidateQueries({
        queryKey: ['tipHistory', creator.primaryAddress],
      });
      void queryClient.invalidateQueries({
        queryKey: ['recipient-stats', creator.primaryAddress],
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [creator, addDonation, queryClient]);

  return null;
};
