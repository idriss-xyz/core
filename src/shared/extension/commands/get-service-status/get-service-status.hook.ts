import { useCommandQuery } from 'shared/messaging/command.hook';

import { GetServiceStatusCommand } from './get-service-status.command';
import { GET_SERVICE_STATUS_QUERY_KEY } from './get-service-status.constants';

export const useGetServiceStatus = () => {
  return useCommandQuery({
    queryKey: GET_SERVICE_STATUS_QUERY_KEY,
    staleTime: 0,
    command: new GetServiceStatusCommand({}),
  });
};
