import { IdrissSendWidgetData } from 'application/idriss-send';

import { UserWidgetData } from '../../types';

interface Properties {
  idrissSendWidgets: IdrissSendWidgetData[];
  applicationsStatus: {
    idrissSend: boolean;
  };
}

/** Adapter which takes widgets available on twitter - IDrissSend,
 * chooses one of them by priority and adapts to UserWidgetData.
 * @applicationsStatus Remember that our app uses the `applicationsStatus` API response, along with the customized by the user `extensionSettings`, to manage the feature state.
 *  */
export const fromTwitterWidgetsData = ({
  applicationsStatus,
  idrissSendWidgets,
}: Properties): UserWidgetData[] => {
  if (!applicationsStatus.idrissSend) {
    return [];
  }

  const idrissSendUsernames = idrissSendWidgets.map((recipient) => {
    return recipient.username;
  });

  const uniqueUsernames = [...new Set(idrissSendUsernames)];

  const recipients = uniqueUsernames.flatMap<UserWidgetData>((username) => {
    const idrissRecipientsForThisUsername = idrissSendWidgets.filter(
      (recipient) => {
        return recipient.username === username;
      },
    );

    return idrissRecipientsForThisUsername;
  });

  return recipients;
};
