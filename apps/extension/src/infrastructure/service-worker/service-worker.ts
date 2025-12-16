/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  DEFAULT_EXTENSION_SETTINGS,
  EXTENSION_BUTTON_CLICKED,
  ExtensionSettingsManager,
} from 'shared/extension';

export class ServiceWorker {
  private constructor(private environment: typeof chrome) {}

  static run(environment: typeof chrome) {
    const serviceWorker = new ServiceWorker(environment);

    serviceWorker.watchStartup();
    serviceWorker.watchInstalled();
    serviceWorker.watchPopupClick();
    serviceWorker.watchWorkerError();
  }

  keepAlive() {
    return setInterval(this.environment.runtime.getPlatformInfo, 20e3);
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
    self.addEventListener('error', () => {});
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
