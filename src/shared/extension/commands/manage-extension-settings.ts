import { Command, OkResult } from '../../messaging';
import {
  ExtensionSettingsManager,
  ExtensionSettingsStorageKey,
} from '../extension-settings-manager';

interface Payload {
  settingKey: ExtensionSettingsStorageKey;
  enabled: boolean;
}

type Response = boolean;

export class ManageExtensionSettingsCommand extends Command<Payload, Response> {
  public readonly name = 'ManageExtensionSettingsCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    chrome.storage.local
      .set({ cacheInvalidate: Date.now() })
      .catch(console.error);
    const allStorage = await chrome.storage.local.get(null);
    for (const x of Object.keys(allStorage).filter((x) => {
      return x.startsWith('cache[');
    })) {
      await chrome.storage.local.remove(x);
      continue;
    }

    if (this.payload.enabled) {
      ExtensionSettingsManager.enable(this.payload.settingKey);
    } else {
      ExtensionSettingsManager.disable(this.payload.settingKey);
    }

    const allSettings = await chrome.storage.local.get();
    const isSettingEnabled = allSettings[this.payload.settingKey];

    return new OkResult(isSettingEnabled);
  }
}
