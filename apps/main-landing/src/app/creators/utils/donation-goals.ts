import { CREATOR_API_URL } from '@idriss-xyz/constants';

import { DonationGoal } from './types';

export const createDonationGoal = async (
  goal: Partial<DonationGoal>,
  authToken: string,
) => {
  const response = await fetch(`${CREATOR_API_URL}/donation-goal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(goal),
  });
  if (!response.ok) {
    throw new Error('Failed to create donation goal');
  }
};

export const activateDonationGoal = async (
  goalId: number,
  authToken: string,
) => {
  const response = await fetch(
    `${CREATOR_API_URL}/donation-goal/${goalId}/activate`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to activate donation goal');
  }
};

export const deactivateDonationGoal = async (
  goalId: number,
  authToken: string,
) => {
  const response = await fetch(
    `${CREATOR_API_URL}/donation-goal/${goalId}/deactivate`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to deactivate donation goal');
  }
};
