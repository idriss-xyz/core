import { useMemo } from 'react';

import { useGitcoinDonationWidgetsData } from 'application/gitcoin';
import { useIdrissSendWidgetsData } from 'application/idriss-send';

import { UserWidgetData } from '../types';

import { useApplicationStatus } from './use-application-status';
import { useScraping } from './use-scraping';

export const useUserWidgets = () => {
  const applicationsStatus = useApplicationStatus();

  const { users } = useScraping();
  const { widgets: idrissSendWidgets } = useIdrissSendWidgetsData({
    scrapedUsers: users,
    enabled: applicationsStatus.idrissSend,
  });

  const { widgets: gitcoinDonationWidgets } = useGitcoinDonationWidgetsData({
    scrapedUsers: users,
    enabled: applicationsStatus.gitcoin,
  });

  const widgets: UserWidgetData[] = useMemo(() => {
    if (!applicationsStatus.gitcoin && !applicationsStatus.idrissSend) {
      return [];
    }

    if (!applicationsStatus.gitcoin) {
      return idrissSendWidgets;
    }

    if (!applicationsStatus.idrissSend) {
      return gitcoinDonationWidgets;
    }

    const idrissSendUsernames = idrissSendWidgets.map((recipient) => {
      return recipient.username;
    });

    const gitcoinDonationUsernames = gitcoinDonationWidgets.map((recipient) => {
      return recipient.username;
    });

    const uniqueUsernames = [
      ...new Set([...idrissSendUsernames, ...gitcoinDonationUsernames]),
    ];

    const recipients = uniqueUsernames.flatMap<UserWidgetData>((username) => {
      const gitcoinRecipientsForThisUsername = gitcoinDonationWidgets.filter(
        (recipient) => {
          return recipient.username === username;
        },
      );

      if (gitcoinRecipientsForThisUsername.length > 0) {
        return gitcoinRecipientsForThisUsername;
      }

      const idrissRecipientsForThisUsername = idrissSendWidgets.filter(
        (recipient) => {
          return recipient.username === username;
        },
      );

      return idrissRecipientsForThisUsername;
    });

    return recipients;
  }, [
    applicationsStatus.gitcoin,
    applicationsStatus.idrissSend,
    gitcoinDonationWidgets,
    idrissSendWidgets,
  ]);

  return { widgets };
};
