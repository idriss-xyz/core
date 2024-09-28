import { Command, OkResult } from '../../messaging';
import { ExtensionSettingsManager } from '../extension-settings-manager';
import { ExtensionSettings } from '../types';

interface Payload {
  settings: Partial<ExtensionSettings>;
}

type Response = ExtensionSettings;

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
    let allSettings = await ExtensionSettingsManager.getAllSettings();

    // as payload.settings can be just partial of ExtensionSettings
    // we merge it with the previous state to not lose any setting
    await ExtensionSettingsManager.setSettings({
      ...allSettings,
      ...this.payload.settings,
    });
    allSettings = await ExtensionSettingsManager.getAllSettings();
    return new OkResult(allSettings);
  }
}
