import { useTwitterHandleToUsernameMap } from 'host/twitter';
import {
  TWITTER_HANDLE_TO_AGORA,
  FARCASTER_HANDLE_TO_AGORA,
} from 'application/agora';
import { FARCASTER_HANDLE_TO_TALLY } from 'application/tally';
import { FARCASTER_HANDLE_TO_SNAPSHOT } from 'application/snapshot';
import { useExtensionSettings } from 'shared/extension';

import { useApplicationStatus } from './use-application-status';
import { useLocationInfo } from './use-location-info';

export const useHandleToOfficialName = () => {
  const applicationsStatus = useApplicationStatus();
  const { extensionSettings } = useExtensionSettings();
  const { isWarpcast, isTwitter, isSupercast } = useLocationInfo();

  const snapshotEnabled =
    applicationsStatus.snapshot && extensionSettings['snapshot-enabled'];

  const { data: twitterSnapshotHandlesMap } = useTwitterHandleToUsernameMap({
    application: 'snapshot',
    enabled: snapshotEnabled,
  });

  const tallyEnabled =
    applicationsStatus.tally && extensionSettings['tally-enabled'];
  const { data: twitterTallyHandlesMap } = useTwitterHandleToUsernameMap({
    application: 'tally',
    enabled: tallyEnabled,
  });

  const agoraEnabled =
    applicationsStatus.agora && extensionSettings['agora-enabled'];

  if (isTwitter) {
    return {
      snapshot: twitterSnapshotHandlesMap ?? {},
      tally: twitterTallyHandlesMap ?? {},
      agora: agoraEnabled ? TWITTER_HANDLE_TO_AGORA : {},
    };
  }

  if (isWarpcast || isSupercast) {
    return {
      snapshot: snapshotEnabled ? FARCASTER_HANDLE_TO_SNAPSHOT : {},
      tally: tallyEnabled ? FARCASTER_HANDLE_TO_TALLY : {},
      agora: agoraEnabled ? FARCASTER_HANDLE_TO_AGORA : {},
    };
  }

  return {
    snapshot: {},
    tally: {},
    agora: {},
  };
};
