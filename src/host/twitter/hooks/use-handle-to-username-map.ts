import { useCommandQuery } from 'shared/messaging';

import { GetHandleToUsernameMapCommand } from '../commands';

interface Properties<T> {
  application: string;
  enabled: boolean;
}
export const useHandleToUsernameMap = <T>({
  enabled,
  application,
}: Properties<T>) => {
  return useCommandQuery({
    command: new GetHandleToUsernameMapCommand({}),
    select: (handles) => {
      return handles[application.toLowerCase()] ?? {};
    },
    enabled,
  });
};
