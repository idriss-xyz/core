export { COMMAND_MAP as OBESRVABILITY_COMMAND_MAP } from './commands';
export { ErrorBoundary } from './components';
export type { ObservabilityScope } from './scope';
export {
  createObservabilityScope,
  WithObservabilityScope,
  useObservabilityScope,
} from './scope';
export { useEventsLogger, WithEventsLogger } from './events';
