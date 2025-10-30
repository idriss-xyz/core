import { Referral } from '@idriss-xyz/db';

export const calculateReward = (followersCount: number) => {
  let reward;

  switch (true) {
    case followersCount >= 100_000_000:
      reward = 25;
      break;
    case followersCount >= 100_000_000:
      reward = 20;
      break;
    case followersCount >= 100_000_000:
      reward = 15;
      break;
    case followersCount >= 100_000_000:
      reward = 10;
      break;
    default:
      reward = 0;
      break;
  }
  return reward;
};

export const getAvailableRewards = (referrals: Referral[]) => {
  return referrals
    .filter((referral) => !referral.credited)
    .reduce(
      (sum, referral) => sum + calculateReward(referral.numberOfFollowers!),
      0,
    );
};
