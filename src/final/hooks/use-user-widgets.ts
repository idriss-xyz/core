import { useGitcoinDonationWidgetsData } from 'application/gitcoin';
import { useIdrissSendWidgetsData } from 'application/idriss-send';

import { userWidgetDataAdapter } from '../adapters';

import { useApplicationStatus } from './use-application-status';
import { useScraping } from './use-scraping';
import { useLocationInfo } from './use-location-info';

export const useUserWidgets = () => {
  const applicationsStatus = useApplicationStatus();
  const { isTwitter, isWarpcast } = useLocationInfo();

  const { users } = useScraping();
  const { widgets: idrissSendWidgets } = useIdrissSendWidgetsData({
    scrapedUsers: users,
    enabled: applicationsStatus.idrissSend && isTwitter,
  });

  const { widgets: gitcoinDonationWidgets } = useGitcoinDonationWidgetsData({
    scrapedUsers: users,
    enabled: applicationsStatus.gitcoin && isTwitter,
  });

  if (isWarpcast) {
    return {
      widgets: userWidgetDataAdapter.fromScrapedUsers({ users }),
    };
  }

  return {
    widgets: userWidgetDataAdapter.fromTwitterWidgetsData({
      applicationsStatus,
      idrissSendWidgets,
      gitcoinDonationWidgets,
    }),
  };
};
