import _ from 'lodash';

import { useIdrissSendWidgetsData } from 'application/idriss-send';
import { useExtensionSettings } from 'shared/extension';

import { userWidgetDataAdapter } from '../adapters';

import { useApplicationStatus } from './use-application-status';
import { useScraping } from './use-scraping';
import { useLocationInfo } from './use-location-info';

export const useUserWidgets = () => {
  const applicationsStatus = useApplicationStatus();
  const { isTwitter } = useLocationInfo();
  const { extensionSettings } = useExtensionSettings();

  const { users: scrapedUsers } = useScraping();

  const users = _.uniqBy(scrapedUsers, 'nodeId');

  const idrissSendEnabled =
    applicationsStatus.idrissSend && extensionSettings['idriss-send-enabled'];

  const { widgets: idrissSendWidgets } = useIdrissSendWidgetsData({
    scrapedUsers: users,
    enabled: idrissSendEnabled && isTwitter,
  });

  return {
    widgets: userWidgetDataAdapter.fromTwitterWidgetsData({
      applicationsStatus: {
        idrissSend: idrissSendEnabled,
      },
      idrissSendWidgets,
    }),
  };
};
