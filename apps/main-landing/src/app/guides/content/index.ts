import { AnswerPageContent } from '@/components/answer-page';

import { streamerChargebacks } from './streamer-chargebacks';
import { twitchPayoutDelays } from './twitch-payout-delays';
import { instantPayoutsForStreamers } from './instant-payouts-for-streamers';

export const guidePages: Record<string, AnswerPageContent> = {
  'streamer-chargebacks': streamerChargebacks,
  'twitch-payout-delays': twitchPayoutDelays,
  'instant-payouts-for-streamers': instantPayoutsForStreamers,
};

export const getAllGuideSlugs = (): string[] => {
  return Object.keys(guidePages);
};
