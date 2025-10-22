import { GetServiceStatusCommand } from 'shared/extension';
import { useCommandQuery } from 'shared/messaging';

export const useApplicationStatus = () => {
  const serviceStatusQuery = useCommandQuery({
    staleTime: Number.POSITIVE_INFINITY,
    command: new GetServiceStatusCommand({}),
  });

  return {
    idrissSend: Boolean(serviceStatusQuery.data?.['idriss-send']),
  };
};
