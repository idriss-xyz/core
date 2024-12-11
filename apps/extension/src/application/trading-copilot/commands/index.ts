import { AddTradingCopilotSubscriptionCommand } from './add-trading-copilot-subscription';
import { GetTradingCopilotSubscriptionsCommand } from './get-trading-copilot-subscriptions';
import { RemoveTradingCopilotSubscriptionCommand } from './remove-trading-copilot-subscription';
import { GetEnsInfoCommand } from './get-ens-info';
import { GetEnsNameCommand } from './get-ens-name';
import { GetEnsAddressCommand } from './get-ens-address';

export const COMMAND_MAP = {
  [AddTradingCopilotSubscriptionCommand.name]:
    AddTradingCopilotSubscriptionCommand,
  [GetTradingCopilotSubscriptionsCommand.name]:
    GetTradingCopilotSubscriptionsCommand,
  [RemoveTradingCopilotSubscriptionCommand.name]:
    RemoveTradingCopilotSubscriptionCommand,
  [GetEnsInfoCommand.name]: GetEnsInfoCommand,
  [GetEnsNameCommand.name]: GetEnsNameCommand,
  [GetEnsAddressCommand.name]: GetEnsAddressCommand,
};

export { AddTradingCopilotSubscriptionCommand } from './add-trading-copilot-subscription';
export { GetTradingCopilotSubscriptionsCommand } from './get-trading-copilot-subscriptions';
export { RemoveTradingCopilotSubscriptionCommand } from './remove-trading-copilot-subscription';
export { GetEnsInfoCommand } from './get-ens-info';
export { GetEnsAddressCommand } from './get-ens-address';
