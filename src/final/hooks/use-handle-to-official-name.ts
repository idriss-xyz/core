import { useTwitterHandleToUsernameMap } from 'host/twitter';
import {
  TWITTER_HANDLE_TO_AGORA,
  FARCASTER_HANDLE_TO_AGORA,
} from 'application/agora';
import { FARCASTER_HANDLE_TO_TALLY } from 'application/tally';
import { FARCASTER_HANDLE_TO_SNAPSHOT } from 'application/snapshot';

import { useApplicationStatus } from './use-application-status';
import { useLocationInfo } from './use-location-info';

export const useHandleToOfficialName = () => {
  const applicationsStatus = useApplicationStatus();
  const { isWarpcast, isTwitter, isSupercast } = useLocationInfo();

  const { data: twitterSnapshotHandlesMap } = useTwitterHandleToUsernameMap({
    application: 'snapshot',
    enabled: applicationsStatus.snapshot,
  });

  const { data: twitterTallyHandlesMap } = useTwitterHandleToUsernameMap({
    application: 'tally',
    enabled: applicationsStatus.tally,
  });

  if (isTwitter) {
    return {
      snapshot: twitterSnapshotHandlesMap ?? {},
      tally: twitterTallyHandlesMap ?? {},
      agora: applicationsStatus.agora ? TWITTER_HANDLE_TO_AGORA : {},
    };
  }

  if (isWarpcast || isSupercast) {
    return {
      snapshot: applicationsStatus.snapshot ? FARCASTER_HANDLE_TO_SNAPSHOT : {},
      tally: applicationsStatus.tally ? FARCASTER_HANDLE_TO_TALLY : {},
      agora: applicationsStatus.agora ? FARCASTER_HANDLE_TO_AGORA : {},
    };
  }

  return {
    snapshot: {},
    tally: {},
    agora: {},
  };
};
