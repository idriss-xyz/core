import { GITCOIN_HANDLER_MAP } from 'application/gitcoin';
import { POLYMARKET_HANDLER_MAP } from 'application/polymarket';
import { SNAPSHOT_HANDLER_MAP } from 'application/snapshot';
import { EXTENSION_HANDLER_MAP } from 'shared/extension';
import { MONITORING_HANDLER_MAP } from 'shared/monitoring';
import { WEB3_HANDLER_MAP } from 'shared/web3';

export const SERVICE_WORKER_COMMAND_HANDLERS_MAP = {
  ...SNAPSHOT_HANDLER_MAP,
  ...POLYMARKET_HANDLER_MAP,
  ...GITCOIN_HANDLER_MAP,
  ...MONITORING_HANDLER_MAP,
  ...WEB3_HANDLER_MAP,
  ...EXTENSION_HANDLER_MAP,
};
