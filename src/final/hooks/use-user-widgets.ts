import { useMemo } from 'react';

import { useGitcoinDonationWidgetsData } from 'application/gitcoin';
import { useIdrissSendWidgetsData } from 'application/idriss-send';
import { useExtensionSettings } from 'shared/extension';

import { UserWidgetData } from '../types';

import { useApplicationStatus } from './use-application-status';
import { useScraping } from './use-scraping';

export const useUserWidgets = () => {
  const applicationsStatus = useApplicationStatus();
  const { extensionSettings } = useExtensionSettings();

  const { users } = useScraping();

  const idrissSendEnabled =
    applicationsStatus.idrissSend && extensionSettings['tipping-enabled'];
  const { widgets: idrissSendWidgets } = useIdrissSendWidgetsData({
    scrapedUsers: users,
    enabled: idrissSendEnabled,
  });

  const gitcoinEnabled =
    applicationsStatus.gitcoin && extensionSettings['gitcoin-enabled'];

  const { widgets: gitcoinDonationWidgets } = useGitcoinDonationWidgetsData({
    scrapedUsers: users,
    enabled: gitcoinEnabled,
  });

  const widgets: UserWidgetData[] = useMemo(() => {
    if (!gitcoinEnabled && !idrissSendEnabled) {
      return [];
    }

    if (!gitcoinEnabled) {
      return idrissSendWidgets;
    }

    if (!idrissSendEnabled) {
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
    gitcoinDonationWidgets,
    gitcoinEnabled,
    idrissSendEnabled,
    idrissSendWidgets,
  ]);

  return { widgets };
};
