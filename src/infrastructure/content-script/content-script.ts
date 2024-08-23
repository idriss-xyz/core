import {
  COMMAND_BUS_REQUEST_MESSAGE,
  COMMAND_BUS_RESPONSE_MESSAGE,
  CommandResponse,
  POPUP_TO_WEBPAGE_MESSAGE,
  SerializedCommand,
  TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY,
  onWindowMessage,
} from 'shared/messaging';
import {
  ExtensionSettingsManager,
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from 'shared/extension';
import { isTwitterHostname } from 'host/twitter';
import { isWarpcastHostname } from 'host/warpcast';
import { isSupercastHostname } from 'host/supercast';
import { EXTENSION_BUTTON_CLICKED } from 'infrastructure/constants';

export class ContentScript {
  private constructor(private environment: typeof chrome) {}

  static run(environment: typeof chrome) {
    const contentScript = new ContentScript(environment);
    if (!contentScript.shouldRun()) {
      return;
    }
    contentScript.injectScriptToWebpage();
    contentScript.bridgeCommunication();

    contentScript.subscribeToExtensionSettings();
  }

  shouldRun() {
    return (
      isTwitterHostname(window.location.hostname ?? '') ||
      isWarpcastHostname(window.location.hostname ?? '') ||
      isSupercastHostname(window.location.hostname ?? '')
    );
  }

  injectScriptToWebpage() {
    const script = document.createElement('script');

    script.src = this.environment.runtime.getURL('webpage-script.js');
    script.dataset.testid = 'idriss-injected-script'; // TODO: constant in shared/extension
    script.id = chrome.runtime.id;
    document.body.append(script);
  }

  bridgeCommunication() {
    this.bridgeFromWebpageScriptToServiceWorker();
    this.bridgeFromExtensionToWebpageScript();
  }

  bridgeFromWebpageScriptToServiceWorker() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onWindowMessage<SerializedCommand<any>>(
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

  bridgeFromExtensionToWebpageScript() {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.type === POPUP_TO_WEBPAGE_MESSAGE) {
        const message = {
          type: request.detail.postMessageType,
          detail: request.detail.data,
        };
        window.postMessage(message);
        return;
      }

      if (request.type === EXTENSION_BUTTON_CLICKED) {
        const message = {
          type: TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY,
        };
        window.postMessage(message);
        return;
      }
    });
  }

  subscribeToExtensionSettings() {
    onWindowMessage(GET_EXTENSION_SETTINGS_REQUEST, async () => {
      const detail = await ExtensionSettingsManager.getAllSettings();

      const message = {
        type: GET_EXTENSION_SETTINGS_RESPONSE,
        detail,
      };
      window.postMessage(message);
    });
  }
}
