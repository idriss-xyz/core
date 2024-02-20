import { getTypeOfTwitterPage } from '../lib/twitter';

import {
  TwitterHandlePageManager,
  TwitterMainFeedPageManager,
} from './managers';

const twitterHandlePageManager = new TwitterHandlePageManager();
const twitterMainFeedPageManager = new TwitterMainFeedPageManager();

const handleTwitterSnapshotInterval = async () => {
  const typeofTwitterPage = getTypeOfTwitterPage(window.location.href);
  if (!typeofTwitterPage) {
    return;
  }

  if (typeofTwitterPage.type === 'handle') {
    twitterMainFeedPageManager.clear();
    await twitterHandlePageManager.run(typeofTwitterPage.handle);
    return;
  }

  if (typeofTwitterPage.type === 'main') {
    twitterHandlePageManager.clear();
    await twitterMainFeedPageManager.run();
    return;
  }
};

let interval: ReturnType<typeof setInterval> | undefined = undefined;

export const startTwitterSnapshot = () => {
  interval = setInterval(handleTwitterSnapshotInterval, 1000);
};

const stopTwitterSnapshot = () => {
  clearInterval(interval);
  interval = undefined;
  twitterMainFeedPageManager.clear();
  twitterHandlePageManager.clear();
};

export const toggleTwitterSnapshot = (isEnabled: boolean) => {
  if (isEnabled) {
    startTwitterSnapshot();
  } else {
    stopTwitterSnapshot();
  }
};
