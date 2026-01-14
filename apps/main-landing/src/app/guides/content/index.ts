import { AnswerPageContent } from '@/components/answer-page';

import { streamerChargebacks } from './streamer-chargebacks';
import { twitchPayoutDelays } from './twitch-payout-delays';

export const guidePages: Record<string, AnswerPageContent> = {
  'streamer-chargebacks': streamerChargebacks,
  'twitch-payout-delays': twitchPayoutDelays,
};

export const getAllGuideSlugs = (): string[] => {
  return Object.keys(guidePages);
};
