import { getTwitterStrategy } from '../ts-utils';

import { TwitterHandlePageManager } from './managers';
import { TwitterMainFeedPageManager } from './managers/twitter-main-feed-page.manager';

const twitterHandlePageManager = new TwitterHandlePageManager();
const twitterMainFeedPageManager = new TwitterMainFeedPageManager();

const handleTwitterInterval = async () => {
  const twitterStrategy = getTwitterStrategy(window.location.href);
  if (!twitterStrategy) {
    return;
  }

  if (twitterStrategy === 'handle') {
    twitterMainFeedPageManager.clear();
    await twitterHandlePageManager.run();
    return;
  }

  if (twitterStrategy === 'main') {
    twitterHandlePageManager.clear();
    await twitterMainFeedPageManager.run();
    return;
  }
};

export const bootstrapTwitter = () => {
  setInterval(handleTwitterInterval, 1000);
};
