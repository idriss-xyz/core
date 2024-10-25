import { SendToAmplitudeCommand } from './send-to-ampliude';
import { SendToSentryCommand } from './send-to-sentry';

export const COMMAND_MAP = {
  [SendToSentryCommand.name]: SendToSentryCommand,
  [SendToAmplitudeCommand.name]: SendToAmplitudeCommand,
};

export { SendToSentryCommand } from './send-to-sentry';
export { SendToAmplitudeCommand } from './send-to-ampliude';
