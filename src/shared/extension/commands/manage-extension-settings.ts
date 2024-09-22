import { Command, OkResult } from '../../messaging';
import {
  ExtensionSettingsManager,
  ExtensionSettingsStorageKey,
} from '../extension-settings-manager';
import { ExtensionSettings } from '../types';

interface Payload {
  settings: Partial<ExtensionSettings>;
}

type Response = Record<ExtensionSettingsStorageKey, boolean>;

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

    ExtensionSettingsManager.setSettings(this.payload.settings);

    const allSettings = (await chrome.storage.local.get()) as Record<
      ExtensionSettingsStorageKey,
      boolean
    >;

    return new OkResult(allSettings);
  }
}
