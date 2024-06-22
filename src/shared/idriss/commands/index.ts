import { GetHandleToTwitterIdCommand } from './get-handle-to-twitter-id';
import { GetDigestToWalletAddressCommand } from './get-digested-to-wallet-address-command';

export const COMMAND_MAP = {
  [GetHandleToTwitterIdCommand.name]: GetHandleToTwitterIdCommand,
  [GetDigestToWalletAddressCommand.name]: GetDigestToWalletAddressCommand,
};

export { GetHandleToTwitterIdCommand } from './get-handle-to-twitter-id';
export { GetDigestToWalletAddressCommand } from './get-digested-to-wallet-address-command';
