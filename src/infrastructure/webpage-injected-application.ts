import { bootstrap } from 'application/bootstrap';
import {
  ExtensionSettings,
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from 'shared/extension';
import { onWindowMessage } from 'shared/messaging';

export class WebpageApplication {
  private constructor() {}

  static run() {
    bootstrap();
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
