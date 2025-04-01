import { Hex } from 'viem';

import {
  COMMAND_BUS_REQUEST_MESSAGE,
  COMMAND_BUS_RESPONSE_MESSAGE,
  CommandResponse,
  POPUP_TO_WEBPAGE_MESSAGE,
  SWAP_EVENT,
  TAB_CHANGED,
  SerializedCommand,
  TOGGLE_EXTENSION_POPUP_VISIBILITY,
  onWindowMessage,
} from 'shared/messaging';
import {
  TradingCopilotManager,
  ExtensionSettingsManager,
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
  EXTENSION_BUTTON_CLICKED,
  ACTIVE_TAB_CHANGED,
  StoredAuthToken,
  StoredToastSoundState,
  StoredSubscriptionsAmount,
  StoredSubscriptions,
} from 'shared/extension';
import {
  AuthTokenWindowMessages,
  DeviceIdWindowMessages,
  SolanaWalletWindowMessages,
  TradingCopilotWindowMessages,
  WalletWindowMessages,
} from 'shared/web3';

export class ContentScript {
  private constructor(private environment: typeof chrome) {}

  static run(environment: typeof chrome) {
    const contentScript = new ContentScript(environment);
    contentScript.injectScriptToWebpage();
    contentScript.bridgeCommunication();

    contentScript.subscribeToExtensionSettings();
    contentScript.subscribeToWallet();
    contentScript.subscribeToTradingCopilot();
    contentScript.subscribeToSolanaWallet();
    contentScript.subscribeToDeviceId();
    contentScript.blockGithubShortcuts();
  }

  static canRun() {
    return ContentScript.allowIFrames() || window.top === window;
  }

  /**
   * Storybook runs in an iframe
   */
  private static allowIFrames() {
    return window.location.hostname === 'localhost';
  }

  injectScriptToWebpage() {
    const script = document.createElement('script');
    script.id = 'idriss-extension-script';
    script.dataset.idrissExtensionId = this.environment.runtime.id;

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

      if (request.type === SWAP_EVENT) {
        const message = {
          type: SWAP_EVENT,
          detail: request.detail,
        };
        window.postMessage(message);
        return;
      }

      if (request.type === TAB_CHANGED) {
        const message = {
          type: TAB_CHANGED,
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

  subscribeToWallet() {
    onWindowMessage(WalletWindowMessages.GET_WALLET, async () => {
      const maybeWallet = await ExtensionSettingsManager.getWallet();

      const message = {
        type: WalletWindowMessages.GET_WALLET_RESPONSE,
        detail: maybeWallet,
      };

      window.postMessage(message);
    });

    onWindowMessage(WalletWindowMessages.CLEAR_WALLET, () => {
      void ExtensionSettingsManager.clearWallet();
    });

    onWindowMessage<{ account: Hex; providerRdns: string }>(
      WalletWindowMessages.SAVE_WALLET,
      (v) => {
        void ExtensionSettingsManager.saveWallet(v);
      },
    );
  }

  subscribeToSolanaWallet() {
    onWindowMessage(SolanaWalletWindowMessages.GET_SOLANA_WALLET, async () => {
      const maybeWallet = await ExtensionSettingsManager.getSolanaWallet();

      const message = {
        type: SolanaWalletWindowMessages.GET_SOLANA_WALLET_RESPONSE,
        detail: maybeWallet,
      };

      window.postMessage(message);
    });

    onWindowMessage(SolanaWalletWindowMessages.CLEAR_SOLANA_WALLET, () => {
      void ExtensionSettingsManager.clearSolanaWallet();
    });

    onWindowMessage<{ account: string; providerName: string }>(
      SolanaWalletWindowMessages.SAVE_SOLANA_WALLET,
      (v) => {
        void ExtensionSettingsManager.saveSolanaWallet(v);
      },
    );
  }

  subscribeToAuthToken() {
    onWindowMessage(AuthTokenWindowMessages.GET_AUTH_TOKEN, async () => {
      const maybeAuthToken = await TradingCopilotManager.getAuthToken();

      const message = {
        type: 'GET_AUTH_TOKEN_RESPONSE',
        detail: maybeAuthToken,
      };

      window.postMessage(message);
    });

    onWindowMessage(AuthTokenWindowMessages.CLEAR_AUTH_TOKEN, () => {
      void TradingCopilotManager.clearAuthToken();
    });

    onWindowMessage<StoredAuthToken>(
      AuthTokenWindowMessages.SAVE_AUTH_TOKEN,
      (v) => {
        void TradingCopilotManager.saveAuthToken(v);
      },
    );
  }

  subscribeToTradingCopilot() {
    onWindowMessage(AuthTokenWindowMessages.GET_AUTH_TOKEN, async () => {
      const maybeAuthToken = await TradingCopilotManager.getAuthToken();

      const message = {
        type: AuthTokenWindowMessages.GET_AUTH_TOKEN_RESPONSE,
        detail: maybeAuthToken,
      };

      window.postMessage(message);
    });

    onWindowMessage(AuthTokenWindowMessages.CLEAR_AUTH_TOKEN, () => {
      void TradingCopilotManager.clearAuthToken();
    });

    onWindowMessage<StoredAuthToken>(
      AuthTokenWindowMessages.SAVE_AUTH_TOKEN,
      (v) => {
        void TradingCopilotManager.saveAuthToken(v);
      },
    );

    onWindowMessage(
      TradingCopilotWindowMessages.GET_TOAST_SOUND_STATE,
      async () => {
        const maybeToastSoundState =
          await TradingCopilotManager.getToastSoundState();

        const message = {
          type: TradingCopilotWindowMessages.GET_TOAST_SOUND_STATE_RESPONSE,
          detail: maybeToastSoundState,
        };

        window.postMessage(message);
      },
    );

    onWindowMessage(
      TradingCopilotWindowMessages.CLEAR_TOAST_SOUND_STATE,
      () => {
        void TradingCopilotManager.clearToastSoundState();
      },
    );

    onWindowMessage<StoredToastSoundState>(
      TradingCopilotWindowMessages.SAVE_TOAST_SOUND_STATE,
      (v) => {
        void TradingCopilotManager.saveToastSoundState(v);
      },
    );

    onWindowMessage(
      TradingCopilotWindowMessages.CLEAR_SUBSCRIPTIONS_AMOUNT,
      () => {
        void TradingCopilotManager.clearSubscriptionsAmount();
      },
    );

    onWindowMessage<StoredSubscriptionsAmount>(
      TradingCopilotWindowMessages.SAVE_SUBSCRIPTIONS_AMOUNT,
      (v) => {
        void TradingCopilotManager.saveSubscriptionsAmount(v);
      },
    );

    onWindowMessage<StoredSubscriptions>(
      TradingCopilotWindowMessages.SAVE_SUBSCRIPTIONS,
      (v) => {
        void TradingCopilotManager.saveSubscriptions(v);
      },
    );

    onWindowMessage(
      TradingCopilotWindowMessages.GET_SUBSCRIPTIONS,
      async () => {
        const maybeSubscriptions =
          await TradingCopilotManager.getSubscriptions();

        const message = {
          type: TradingCopilotWindowMessages.GET_SUBSCRIPTIONS_RESPONSE,
          detail: maybeSubscriptions,
        };

        window.postMessage(message);
      },
    );
  }

  subscribeToDeviceId() {
    onWindowMessage(DeviceIdWindowMessages.GET_DEVICE_ID, async () => {
      const maybeDeviceId = await ExtensionSettingsManager.getDeviceId();

      const message = {
        type: DeviceIdWindowMessages.GET_DEVICE_ID_RESPONSE,
        detail: maybeDeviceId,
      };

      window.postMessage(message);
    });

    onWindowMessage<string>(DeviceIdWindowMessages.SET_DEVICE_ID, (v) => {
      void ExtensionSettingsManager.setDeviceId(v);
    });
  }

  blockGithubShortcuts() {
    document.addEventListener(
      'keydown',
      (event) => {
        const activeElement = document.activeElement;

        if (
          activeElement?.classList.contains('idriss-root') &&
          window.location.hostname === 'github.com'
        ) {
          event.stopPropagation();
        }
      },
      true,
    );
  }
}
