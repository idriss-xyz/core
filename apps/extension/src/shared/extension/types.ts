export type ExtensionSettings = Record<ExtensionSettingName, boolean>;

export type ExtensionSettingName =
  | 'entire-extension-enabled'
  | 'idriss-send-enabled'
  | 'wallet-lookup-enabled';

export type StoredAuthToken = string | undefined;

export type StoredToastSoundState = boolean | undefined;

export type StoredSubscriptionsAmount = number | undefined;

type Subcription = {
  address: string;
  fid: number;
  createdAt: number;
};

export type StoredSubscriptions = Subcription[] | undefined;
