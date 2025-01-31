import { AddTradingCopilotSubscriptionCommand } from './add-trading-copilot-subscription';
import { GetTradingCopilotSubscriptionsCommand } from './get-trading-copilot-subscriptions';
import { RemoveTradingCopilotSubscriptionCommand } from './remove-trading-copilot-subscription';
import { GetEnsInfoCommand } from './get-ens-info';
import { GetEnsNameCommand } from './get-ens-name';
import { GetEnsAddressCommand } from './get-ens-address';
import { GetFarcasterAddressCommand } from './get-farcaster-address';
import { GetFarcasterUserCommand } from './get-farcaster-user';
import { GetQuoteCommand } from './get-quote';
import { GetEnsBalanceCommand } from './get-ens-balance';
import { GetSiweMessageCommand } from './get-siwe-message';
import { VerifySiweSignatureCommand } from './verify-siwe-signature';
import { GetTokensListCommand } from './get-tokens-list';
import { GetTokensImageCommand } from './get-tokens-image';
import { VerifyTokenCommand } from './verify-token';
import { GetStakedBalanceCommand } from './get-staked-balance';
import { GetStakedBonusBalanceCommand } from './get-staked-bonus-balance';

export const COMMAND_MAP = {
  [AddTradingCopilotSubscriptionCommand.name]:
    AddTradingCopilotSubscriptionCommand,
  [GetTradingCopilotSubscriptionsCommand.name]:
    GetTradingCopilotSubscriptionsCommand,
  [RemoveTradingCopilotSubscriptionCommand.name]:
    RemoveTradingCopilotSubscriptionCommand,
  [GetFarcasterAddressCommand.name]: GetFarcasterAddressCommand,
  [GetFarcasterUserCommand.name]: GetFarcasterUserCommand,
  [GetEnsInfoCommand.name]: GetEnsInfoCommand,
  [GetEnsNameCommand.name]: GetEnsNameCommand,
  [GetEnsAddressCommand.name]: GetEnsAddressCommand,
  [GetQuoteCommand.name]: GetQuoteCommand,
  [GetEnsBalanceCommand.name]: GetEnsBalanceCommand,
  [GetSiweMessageCommand.name]: GetSiweMessageCommand,
  [VerifySiweSignatureCommand.name]: VerifySiweSignatureCommand,
  [GetTokensListCommand.name]: GetTokensListCommand,
  [GetTokensImageCommand.name]: GetTokensImageCommand,
  [VerifyTokenCommand.name]: VerifyTokenCommand,
  [GetStakedBalanceCommand.name]: GetStakedBalanceCommand,
  [GetStakedBonusBalanceCommand.name]: GetStakedBonusBalanceCommand,
};

export { PREMIUM_THRESHOLD, FREE_SUBSCRIPTIONS } from './constants';
export { AddTradingCopilotSubscriptionCommand } from './add-trading-copilot-subscription';
export { GetTradingCopilotSubscriptionsCommand } from './get-trading-copilot-subscriptions';
export { RemoveTradingCopilotSubscriptionCommand } from './remove-trading-copilot-subscription';
export { GetEnsInfoCommand } from './get-ens-info';
export { GetEnsNameCommand } from './get-ens-name';
export { GetEnsAddressCommand } from './get-ens-address';
export { GetFarcasterAddressCommand } from './get-farcaster-address';
export { GetFarcasterUserCommand } from './get-farcaster-user';
export { GetSiweMessageCommand } from './get-siwe-message';
export { VerifySiweSignatureCommand } from './verify-siwe-signature';
export { GetEnsBalanceCommand } from './get-ens-balance';
export { GetQuoteCommand } from './get-quote';
export { GetTokensListCommand } from './get-tokens-list';
export { GetTokensImageCommand } from './get-tokens-image';
export { VerifyTokenCommand } from './verify-token';
export { GetStakedBalanceCommand } from './get-staked-balance';
export { GetStakedBonusBalanceCommand } from './get-staked-bonus-balance';
