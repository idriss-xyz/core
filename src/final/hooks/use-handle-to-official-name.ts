import { useTwitterHandleToUsernameMap } from 'host/twitter';
import {
  TWITTER_HANDLE_TO_AGORA,
  WARPCAST_HANDLE_TO_AGORA,
} from 'application/agora';
import { WARPCAST_HANDLE_TO_TALLY } from 'application/tally';
import { WARPCAST_HANDLE_TO_SNAPSHOT } from 'application/snapshot';

import { useApplicationStatus } from './use-application-status';
import { useLocationInfo } from './use-location-info';

export const useHandleToOfficialName = () => {
  const applicationsStatus = useApplicationStatus();
  const { isWarpcast, isTwitter } = useLocationInfo();

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
      agora: TWITTER_HANDLE_TO_AGORA,
    };
  }

  if (isWarpcast) {
    return {
      snapshot: WARPCAST_HANDLE_TO_SNAPSHOT,
      tally: WARPCAST_HANDLE_TO_TALLY,
      agora: WARPCAST_HANDLE_TO_AGORA,
    };
  }

  return {
    snapshot: {},
    tally: {},
    agora: {},
  };
};
