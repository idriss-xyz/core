import { useCommandQuery } from 'shared/messaging';

import { GetHandleToUsernameMapCommand } from '../commands';

interface Properties {
  application: string;
  enabled: boolean;
}
export const useHandleToUsernameMap = ({
  enabled,
  application,
}: Properties) => {
  return useCommandQuery({
    command: new GetHandleToUsernameMapCommand({}),
    select: (handles) => {
      return handles[application.toLowerCase()] ?? {};
    },
    enabled,
  });
};
