import { useGitcoinDonationWidgetsData } from 'application/gitcoin';
import { useIdrissSendWidgetsData } from 'application/idriss-send';
import { useExtensionSettings } from 'shared/extension';

import { userWidgetDataAdapter } from '../adapters';

import { useApplicationStatus } from './use-application-status';
import { useScraping } from './use-scraping';
import { useLocationInfo } from './use-location-info';

export const useUserWidgets = () => {
  const applicationsStatus = useApplicationStatus();
  const { isTwitter, isWarpcast } = useLocationInfo();
  const { extensionSettings } = useExtensionSettings();

  const { users } = useScraping();

  const idrissSendEnabled =
    applicationsStatus.idrissSend && extensionSettings['idriss-send-enabled'];

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

  if (isWarpcast) {
    return {
      // widgets: userWidgetDataAdapter.fromScrapedUsers({ users }), // TODO: uncomment to enable user widgets on Warpcast
      widgets: [],
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
