import { GitcoinDonationWidgetData } from 'application/gitcoin';
import { IdrissSendWidgetData } from 'application/idriss-send';

import { UserWidgetData } from '../../types';

interface Properties {
  idrissSendWidgets: IdrissSendWidgetData[];
  gitcoinDonationWidgets: GitcoinDonationWidgetData[];
  applicationsStatus: {
    gitcoin: boolean;
    idrissSend: boolean;
  };
}

/** Adapter which takes widgets available on twitter - IDrissSend and GitcoinDonation,
 * chooses one of them by priority and adapts to UserWidgetData. */
export const fromTwitterWidgetsData = ({
  applicationsStatus,
  gitcoinDonationWidgets,
  idrissSendWidgets,
}: Properties): UserWidgetData[] => {
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
};
