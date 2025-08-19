import { Referral } from '../db/entities';

export const calculateReward = (followersCount: number) => {
  let reward;

  switch (true) {
    case followersCount >= 100_000:
      reward = 25;
      break;
    case followersCount >= 10_000:
      reward = 20;
      break;
    case followersCount >= 1_000:
      reward = 15;
      break;
    case followersCount >= 100:
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
