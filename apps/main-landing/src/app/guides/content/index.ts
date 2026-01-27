import { AnswerPageContent } from '@/components/answer-page';

import { bestDonationPlatformSmallStreamers } from './best-donation-platform-small-streamers';
import { bestWaysToMonetizeStream } from './best-ways-to-monetize-stream';
import { cryptoVsPaypalDonations } from './crypto-vs-paypal-donations';
import { howToAvoidDonationChargebacks } from './how-to-avoid-donation-chargebacks';
import { onStreamDonations } from './on-stream-donations';
import { paypalDonationFeesStreamers } from './paypal-donation-fees-streamers';
import { streamerChargebacks } from './streamer-chargebacks';
import { twitchPayoutDelays } from './twitch-payout-delays';

export const guidePages: Record<string, AnswerPageContent> = {
  'best-donation-platform-small-streamers': bestDonationPlatformSmallStreamers,
  'best-ways-to-monetize-stream': bestWaysToMonetizeStream,
  'crypto-vs-paypal-donations': cryptoVsPaypalDonations,
  'how-to-avoid-donation-chargebacks': howToAvoidDonationChargebacks,
  'on-stream-donations': onStreamDonations,
  'paypal-donation-fees-streamers': paypalDonationFeesStreamers,
  'streamer-chargebacks': streamerChargebacks,
  'twitch-payout-delays': twitchPayoutDelays,
};

export const getAllGuideSlugs = (): string[] => {
  return Object.keys(guidePages);
};
