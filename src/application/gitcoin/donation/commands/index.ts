import {
  GetApplicationsCommand,
  GetApplicationsHandler,
} from './get-applications';

export {
  GetApplicationsCommand,
  useGetApplicationsCommand,
} from './get-applications';

export const HANDLER_MAP = {
  [GetApplicationsCommand.name]: new GetApplicationsHandler(),
};
