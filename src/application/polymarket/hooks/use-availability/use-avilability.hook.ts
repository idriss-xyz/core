import { useQuery } from '@tanstack/react-query';

import { GetAvailabilityCommand } from '../../commands';

const getAvailability = async () => {
  const command = new GetAvailabilityCommand({});
  return command.send();
};

export const useAvailability = () => {
  return useQuery({
    queryKey: ['getAvailability'],
    placeholderData: (previousData) => {
      return previousData;
    },
    queryFn: () => {
      return getAvailability();
    },
  });
};
