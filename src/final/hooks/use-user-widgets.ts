import { useGitcoinDonationWidgetsData } from 'application/gitcoin';
import { useIdrissSendWidgetsData } from 'application/idriss-send';
import { useExtensionSettings } from 'shared/extension';
import { useCommandQuery } from 'shared/messaging';
import { GetFollowersCommand } from 'shared/farcaster';

import { userWidgetDataAdapter } from '../adapters';

import { useApplicationStatus } from './use-application-status';
import { useScraping } from './use-scraping';
import { useLocationInfo } from './use-location-info';

export const useUserWidgets = () => {
  const applicationsStatus = useApplicationStatus();
  const { isTwitter, isWarpcast, isSupercast } = useLocationInfo();
  const isFarcaster = isSupercast || isWarpcast;
  const { extensionSettings } = useExtensionSettings();

  const { users } = useScraping();

  const idrissSendEnabled =
    applicationsStatus.idrissSend && extensionSettings['idriss-send-enabled'];

  const followersQuery = useCommandQuery({
    command: new GetFollowersCommand({}),
    enabled: idrissSendEnabled && isFarcaster,
    placeholderData: (previousData) => {
      return previousData;
    },
  });

  const { widgets: idrissSendWidgets } = useIdrissSendWidgetsData({
    scrapedUsers: users,
    enabled: idrissSendEnabled && isTwitter,
  });

  const gitcoinEnabled =
    applicationsStatus.gitcoin && extensionSettings['gitcoin-enabled'];

  const { widgets: gitcoinDonationWidgets } = useGitcoinDonationWidgetsData({
    scrapedUsers: users,
    enabled: gitcoinEnabled && isTwitter,
  });

  if (isFarcaster) {
    const usersThatFollowIdriss = users
      .map((user) => {
        const followerData = followersQuery.data?.[user.data.username];
        if (!followerData) {
          return;
        }
        return {
          ...user,
          data: {
            ...user.data,
            walletAddress: followerData.address,
          },
        };
      })
      .filter(Boolean);

    return {
      widgets: userWidgetDataAdapter.fromFarcasterUsers({
        users: usersThatFollowIdriss,
      }),
    };
  }

  return {
    widgets: userWidgetDataAdapter.fromTwitterWidgetsData({
      applicationsStatus: {
        gitcoin: gitcoinEnabled,
        idrissSend: idrissSendEnabled,
      },
      idrissSendWidgets,
      gitcoinDonationWidgets,
    }),
  };
};
