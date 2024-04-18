import { useCommandQuery } from 'shared/messaging/command.hook';

import { GetApplicationsResponse } from '../../donation.types';

import { GetApplicationsCommand } from './get-applications.command';
import { GET_APPLICATIONS_QUERY_KEY } from './get-applications.constants';

interface Properties<MappedResponse = GetApplicationsResponse> {
  select?: (response: GetApplicationsResponse) => MappedResponse;
}

export const useGetApplicationsCommand = <MappedResponse>({
  select,
}: Properties<MappedResponse> = {}) => {
  return useCommandQuery({
    queryKey: GET_APPLICATIONS_QUERY_KEY,
    command: new GetApplicationsCommand({}),
    select,
  });
};
