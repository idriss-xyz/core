import {
  COMMAND_BUS_REQUEST_MESSAGE,
  COMMAND_BUS_RESPONSE_MESSAGE,
  CommandResponse,
  POPUP_TO_WEBPAGE_MESSAGE,
  SerializedCommand,
  TOGGLE_EXTENSION_POPUP_VISIBILITY,
  onWindowMessage,
} from 'shared/messaging';
import {
  ExtensionSettingsManager,
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
  EXTENSION_BUTTON_CLICKED,
  ACTIVE_TAB_CHANGED,
} from 'shared/extension';
import { Hex } from 'shared/web3';

export class ContentScript {
  private constructor(private environment: typeof chrome) {}

  static run(environment: typeof chrome) {
    const contentScript = new ContentScript(environment);
    contentScript.injectScriptToWebpage();
    contentScript.bridgeCommunication();

    contentScript.subscribeToExtensionSettings();
    contentScript.subscribeToWallet();
    contentScript.subscribeToDeviceId();
  }

  static canRun() {
    return window.top === window;
  }

  injectScriptToWebpage() {
    const script = document.createElement('script');

    script.src = this.environment.runtime.getURL('webpage-script.js');
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
    chrome.runtime.onMessage.addListener(async (request) => {
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
          type: TOGGLE_EXTENSION_POPUP_VISIBILITY,
        };
        window.postMessage(message);
        return;
      }

      if (request.type === ACTIVE_TAB_CHANGED) {
        const detail = await ExtensionSettingsManager.getAllSettings();

        const message = {
          type: GET_EXTENSION_SETTINGS_RESPONSE,
          detail,
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

  // TODO: move these message names to constants in shared/web3
  subscribeToWallet() {
    onWindowMessage('GET_WALLET', async () => {
      const maybeWallet = await ExtensionSettingsManager.getWallet();

      const message = {
        type: 'GET_WALLET_RESPONSE',
        detail: maybeWallet,
      };

      window.postMessage(message);
    });

    onWindowMessage('CLEAR_WALLET', () => {
      void ExtensionSettingsManager.clearWallet();
    });

    onWindowMessage<{ account: Hex; providerRdns: string }>(
      'SAVE_WALLET',
      (v) => {
        void ExtensionSettingsManager.saveWallet(v);
      },
    );
  }

  // TODO: move these message names to constants in shared/web3
  subscribeToDeviceId() {
    onWindowMessage('GET_DEVICE_ID', async () => {
      const maybeDeviceId = await ExtensionSettingsManager.getDeviceId();

      const message = {
        type: 'GET_DEVICE_ID_RESPONSE',
        detail: maybeDeviceId,
      };

      window.postMessage(message);
    });

    onWindowMessage<string>('SET_DEVICE_ID', (v) => {
      void ExtensionSettingsManager.setDeviceId(v);
    });
  }
}
