import { Command, OkResult } from '../../messaging';
import { ExtensionSettingsManager } from '../extension-settings-manager';
import { ExtensionSettings } from '../types';

interface Payload {
  settings: Partial<ExtensionSettings>;
}

type Response = boolean;

export class ChangeExtensionSettingsCommand extends Command<Payload, Response> {
  public readonly name = 'ChangeExtensionSettingsCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    const allSettings = await ExtensionSettingsManager.getAllSettings();

    // as payload.settings can be just partial of ExtensionSettings
    // we merge it with the previous state to not lose any setting
    await ExtensionSettingsManager.setSettings({
      ...allSettings,
      ...this.payload.settings,
    });
    return new OkResult(true);
  }
}
