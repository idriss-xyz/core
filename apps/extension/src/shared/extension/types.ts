export type ExtensionSettings = Record<ExtensionSettingName, boolean>;

export type ExtensionSettingName =
  | 'entire-extension-enabled'
  | 'idriss-send-enabled'
  | 'wallet-lookup-enabled'
  | 'snapshot-enabled'
  | 'tally-enabled'
  | 'agora-enabled'
  | 'polymarket-enabled'
  | 'gitcoin-enabled'
  | 'kaito-enabled'
  | 'trading-copilot-latest-transactions-enabled'
  | 'trading-copilot-notifications-enabled';

export type StoredAuthToken = string | undefined;

export type StoredToastSoundState = boolean | undefined;

export type StoredSubscriptionsAmount = number | undefined;

type Subcription = {
  address: string;
  fid: number;
  createdAt: number;
};

export type StoredSubscriptions = Subcription[] | undefined;
