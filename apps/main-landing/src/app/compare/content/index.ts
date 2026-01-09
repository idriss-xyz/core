import { AnswerPageContent } from '@/components/answer-page';

import { idrissVsStreamlabs } from './idriss-vs-streamlabs';
import { streamlabsVsStreamelements } from './streamlabs-vs-streamelements';
import { streamlabsVsTwitchPayouts } from './streamlabs-vs-twitch-payouts';

export const comparePages: Record<string, AnswerPageContent> = {
  'idriss-vs-streamlabs': idrissVsStreamlabs,
  'streamlabs-vs-streamelements': streamlabsVsStreamelements,
  'streamlabs-vs-twitch-payouts': streamlabsVsTwitchPayouts,
};

export const getAllCompareSlugs = (): string[] => {
  return Object.keys(comparePages);
};
