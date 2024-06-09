import {
  COMMAND_BUS_REQUEST_MESSAGE,
  COMMAND_BUS_RESPONSE_MESSAGE,
  Command,
  CommandResponse,
  POPUP_TO_WEBPAGE_MESSAGE,
  onWindowMessage,
} from 'shared/messaging';
import {
  ExtensionSettings,
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from 'shared/extension';

import { ExperimentalFeaturesSettingsManager } from '../popup/experimental-features-settings-manager';

export class ContentScript {
  private constructor(private environment: typeof chrome) {}

  static run(environment: typeof chrome) {
    const contentScript = new ContentScript(environment);
    contentScript.injectScriptToWebpage();
    contentScript.bridgeFromWebpageScriptToServiceWorker();
    contentScript.bridgeFromExtensionToWebpageScript();
    contentScript.onGetExtensionSettings();
  }

  onGetExtensionSettings() {
    onWindowMessage(GET_EXTENSION_SETTINGS_REQUEST, async () => {
      const detail: ExtensionSettings = {
        experimentalFeatures:
          await ExperimentalFeaturesSettingsManager.isEnabled(),
      };
      const message = {
        type: GET_EXTENSION_SETTINGS_RESPONSE,
        detail,
      };
      window.postMessage(message);
    });
  }

  injectScriptToWebpage() {
    const script = document.createElement('script');

    script.src = this.environment.runtime.getURL('webpage-script.js');
    document.body.append(script);
  }

  bridgeFromExtensionToWebpageScript() {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.type === POPUP_TO_WEBPAGE_MESSAGE) {
        const message = {
          type: request.detail.postMessageType,
          detail: request.detail.data,
        };
        window.postMessage(message);
      }
    });
  }

  bridgeFromWebpageScriptToServiceWorker() {
    onWindowMessage<Command<unknown, unknown>>(
      COMMAND_BUS_REQUEST_MESSAGE,
      (command) => {
        chrome.runtime.sendMessage(
          {
            type: COMMAND_BUS_REQUEST_MESSAGE,
            data: command,
          },
          (response) => {
            const messageDetail: CommandResponse<unknown> = {
              response,
              commandId: command.id,
            };

            const message = {
              type: COMMAND_BUS_RESPONSE_MESSAGE,
              detail: messageDetail,
            };

            window.postMessage(message);
          },
        );
      },
    );
  }
}
