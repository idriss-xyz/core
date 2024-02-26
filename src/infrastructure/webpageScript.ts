import { onWindowMessage } from '../lib/dom';
import { toggleTwitterSnapshot } from '../snapshot';

import {
  EXTENSION_SETTINGS_CHANGE,
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from './constants';
import { ExtensionSettings } from './types';

export class WebpageScript {
  private constructor() {}

  static async run() {
    const settings = await WebpageScript.getExtensionSettings();

    if (settings.experimentalFeatures) {
      toggleTwitterSnapshot(settings.experimentalFeatures);
    }

    onWindowMessage<ExtensionSettings>(
      EXTENSION_SETTINGS_CHANGE,
      (settings) => {
        toggleTwitterSnapshot(settings.experimentalFeatures);
      },
    );
  }

  static async getExtensionSettings(): Promise<ExtensionSettings> {
    return new Promise((resolve) => {
      window.postMessage({
        type: GET_EXTENSION_SETTINGS_REQUEST,
      });

      onWindowMessage<ExtensionSettings>(
        GET_EXTENSION_SETTINGS_RESPONSE,
        (settings, removeEventListener) => {
          resolve(settings);
          removeEventListener();
        },
      );
    });
  }
}
