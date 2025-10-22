/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Command,
  COMMAND_BUS_REQUEST_MESSAGE,
  FailureResult,
  JsonValue,
  SerializedCommand,
} from 'shared/messaging';
import { WEB3_COMMAND_MAP } from 'shared/web3';
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

const COMMAND_MAP = {
  ...WEB3_COMMAND_MAP,
  ...OBESRVABILITY_COMMAND_MAP,
  ...EXTENSION_COMMAND_MAP,
  ...UTILS_COMMAND_MAP,
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
      this.environment.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
          if (ServiceWorker.isValidTab(tab)) {
            this.environment.scripting.executeScript(
              {
                target: { tabId: tab.id },
                func: () => {
                  return !!document.querySelector('#idriss-extension-script');
                },
              },
              async (results) => {
                const [result] = results || [];
                if (!result?.result) {
                  await this.environment.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content-script.js'],
                  });
                }
              },
            );
          }
        }
      });

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
        !tab.url?.startsWith('edge') &&
        !tab.url?.startsWith('chrome') &&
        !tab.url?.startsWith('edge') &&
        !tab.url?.startsWith('about'),
    );
  };
}
