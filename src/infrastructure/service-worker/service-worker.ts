import { TWITTER_COMMAND_MAP } from 'host/twitter';
import {
  Command,
  COMMAND_BUS_REQUEST_MESSAGE,
  FailureResult,
  JsonValue,
  SerializedCommand,
} from 'shared/messaging';
import { WEB3_COMMAND_MAP } from 'shared/web3';
import { GITCOIN_DONATION_COMMAND_MAP } from 'application/gitcoin';
import { POLYMARKET_COMMAND_MAP } from 'application/polymarket';
import { SNAPSHOT_COMMAND_MAP } from 'application/snapshot';
import {
  DEFAULT_EXTENSION_SETTINGS,
  EXTENSION_BUTTON_CLICKED,
  EXTENSION_COMMAND_MAP,
  ExtensionSettingsManager,
} from 'shared/extension';
import {
  createObservabilityScope,
  OBESRVABILITY_COMMAND_MAP,
  ObservabilityScope,
} from 'shared/observability';
import { UTILS_COMMAND_MAP } from 'shared/utils';
import { AGORA_COMMAND_MAP } from 'application/agora';
import { IDRISS_COMMAND_MAP } from 'shared/idriss';
import { IDRISS_SEND_COMMAND_MAP } from 'application/idriss-send';
import { TALLY_COMMAND_MAP } from 'application/tally';
import { FARCASTER_COMMAND_MAP } from 'shared/farcaster';
import { TRADING_COPILOT_COMMAND_MAP } from 'application/trading-copilot';

import { SbtResolver } from '../../common/resolvers/SbtResolver';
import { AddressResolver } from '../../common/resolvers/AddressResolver';

const COMMAND_MAP = {
  ...WEB3_COMMAND_MAP,
  ...OBESRVABILITY_COMMAND_MAP,
  ...GITCOIN_DONATION_COMMAND_MAP,
  ...POLYMARKET_COMMAND_MAP,
  ...EXTENSION_COMMAND_MAP,
  ...SNAPSHOT_COMMAND_MAP,
  ...UTILS_COMMAND_MAP,
  ...TWITTER_COMMAND_MAP,
  ...AGORA_COMMAND_MAP,
  ...IDRISS_COMMAND_MAP,
  ...IDRISS_SEND_COMMAND_MAP,
  ...TALLY_COMMAND_MAP,
  ...FARCASTER_COMMAND_MAP,
  ...TRADING_COPILOT_COMMAND_MAP,
};

export class ServiceWorker {
  private observabilityScope: ObservabilityScope =
    createObservabilityScope('service-worker');
  private constructor(private environment: typeof chrome) {}

  static run(environment: typeof chrome) {
    const serviceWorker = new ServiceWorker(environment);

    serviceWorker.watchCommands();
    serviceWorker.watchStartup();
    serviceWorker.watchInstalled();
    serviceWorker.watchPopupClick();
    serviceWorker.watchLegacyMessages();
    serviceWorker.watchWorkerError();
  }

  keepAlive() {
    return setInterval(this.environment.runtime.getPlatformInfo, 20e3);
  }

  watchCommands() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.onMessage<SerializedCommand<unknown>>(
      COMMAND_BUS_REQUEST_MESSAGE,
      (serializedCommand, sendResponse) => {
        const commandDefinition = COMMAND_MAP[serializedCommand.name];
        if (!commandDefinition) {
          const error = new Error(
            `Missing command definition for ${serializedCommand.name}. Make sure it's added to COMMAND_MAP`,
          );
          this.observabilityScope.captureException(error);
          throw error;
        }

        const command = new commandDefinition(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          serializedCommand.payload as any,
        ) as Command<unknown, JsonValue>;
        command.id = serializedCommand.id;
        command.observabilityScope = this.observabilityScope;

        command
          .handle()
          .then((response: unknown) => {
            return sendResponse(response);
          })
          .catch((error: unknown) => {
            this.observabilityScope.captureException(error);
            return sendResponse(new FailureResult('Service worker error'));
          });
      },
    );
  }

  onMessage<Data>(
    type: string,
    callback: (data: Data, sendResponse: (response: unknown) => void) => void,
  ) {
    this.environment.runtime.onMessage.addListener(
      (request, _sender, sendResponse) => {
        if (request.type === type) {
          callback(request.data, sendResponse);
        }

        return true;
      },
    );
  }

  // TODO: refactor
  watchLegacyMessages() {
    this.environment.runtime.onMessage.addListener(
      (request, _sender, sendResponse) => {
        switch (request.type) {
          case 'apiAddressesRequest': {
            AddressResolver.get(request.value)
              .then((x) => {
                return sendResponse(x);
              })
              .catch(() => {
                return sendResponse({});
              });
            return true;
          }
          case 'reverseResolveRequest': {
            AddressResolver.getManyReverse(request.value)
              .then((x) => {
                return sendResponse(x);
              })
              .catch(() => {
                return sendResponse({});
              });
            return true;
          }
          case 'sbtRequest': {
            SbtResolver.getSBT(request.value)
              .then((x) => {
                return sendResponse(x);
              })
              .catch(() => {
                return sendResponse({});
              });
            return true;
          }
          case 'getIconUrl': {
            if (request.custom == '') {
              fetch(this.environment.runtime.getURL('img/icon148.png'))
                .then((fetchRequest) => {
                  return fetchRequest.blob();
                })
                .then((blob) => {
                  return this.readBlob(blob);
                })
                .then((x) => {
                  return sendResponse(x);
                })
                .catch(console.error);
              return true;
            } else {
              fetch(this.environment.runtime.getURL(request.custom))
                .then((fetchRequest) => {
                  return fetchRequest.blob();
                })
                .then((blob) => {
                  return this.readBlob(blob);
                })
                .then((x) => {
                  return sendResponse(x);
                })
                .catch(console.error);
              return true;
            }
          }
          case 'getTwitterIconUrl': {
            fetch(this.environment.runtime.getURL('img/twitter.svg'))
              .then((fetchRequest) => {
                return fetchRequest.blob();
              })
              .then((blob) => {
                return this.readBlob(blob);
              })
              .then((x) => {
                return sendResponse(x);
              })
              .catch(console.error);
            return true;
          }
          // No default
        }

        return true;
      },
    );
  }

  readBlob(b: Blob) {
    return new Promise(function (resolve) {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(b);
    });
  }

  watchStartup() {
    this.environment.runtime.onStartup.addListener(() => {
      return this.keepAlive();
    });
  }

  watchInstalled() {
    this.environment.runtime.onInstalled.addListener(() => {
      void ExtensionSettingsManager.getAllSettings().then((currentSettings) => {
        void ExtensionSettingsManager.setSettings({
          ...DEFAULT_EXTENSION_SETTINGS,
          ...currentSettings,
        });
      });
    });
  }

  watchPopupClick() {
    this.environment.action.onClicked.addListener(() => {
      this.environment.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => {
          const activeTab = tabs[0];
          if (ServiceWorker.isValidTab(activeTab)) {
            this.environment.tabs
              .sendMessage(activeTab.id, {
                type: EXTENSION_BUTTON_CLICKED,
              })
              .catch(console.error);
          }
        },
      );
    });
  }

  watchWorkerError() {
    self.addEventListener('error', (event) => {
      this.observabilityScope.captureException(event.error);
    });
  }

  private static isValidTab = (
    tab?: chrome.tabs.Tab,
  ): tab is chrome.tabs.Tab & { id: number } => {
    return Boolean(
      tab?.id &&
        tab.url &&
        tab.url?.length > 0 &&
        !tab.url?.startsWith('chrome') &&
        !tab.url?.startsWith('about'),
    );
  };
}
