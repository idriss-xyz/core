import { onWindowMessage } from '../lib/dom';

import { ServiceWorkerCommand, ServiceWorkerResponse } from './command-bus';
import {
  COMMAND_BUS_RESPONSE_MESSAGE,
  COMMAND_BUS_REQUEST_MESSAGE,
  POPUP_TO_WEBPAGE_MESSAGE,
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from './constants';
import { ExperimentalFeaturesSettingsManager } from './popup/experimentalFeaturesSettingsManager';
import { ExtensionSettings } from './types';

export class ContentScript {
  private constructor(private environment: typeof chrome) {}

  static async run(environment: typeof chrome) {
    const contentScript = new ContentScript(environment);
    await contentScript.injectScriptToWebpage();
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

  async injectScriptToWebpage() {
    const script = document.createElement('script');

    script.src = this.environment.runtime.getURL('webpageScript.js');
    document.body.appendChild(script);
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
    onWindowMessage<ServiceWorkerCommand>(
      COMMAND_BUS_REQUEST_MESSAGE,
      (command) => {
        chrome.runtime.sendMessage(
          {
            type: COMMAND_BUS_REQUEST_MESSAGE,
            data: command,
          },
          (response) => {
            const messageDetail: ServiceWorkerResponse<unknown> = {
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
