import {
  GetServiceStatusCommand,
  GetServiceStatusHandler,
} from './get-service-status';

export {
  useGetServiceStatus,
  GET_SERVICE_STATUS_QUERY_KEY,
} from './get-service-status';

export const HANDLER_MAP = {
  [GetServiceStatusCommand.name]: new GetServiceStatusHandler(),
};
