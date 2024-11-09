export {
  COMMAND_MAP as IDRISS_COMMAND_MAP,
  GetHandleToTwitterIdCommand,
  GetDigestToWalletAddressCommand,
} from './commands';
export { Send as IdrissSend } from './components';
export { IDRISS_IDENTIFIER_TYPE } from './constants';
export {
  getIdrissIdentifierType,
  normalizePhoneIdentifier,
  normalizeTwitterIdentifier,
} from './utils';
