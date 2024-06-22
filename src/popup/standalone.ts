/* eslint-disable boundaries/no-unknown-files */
import { StandalonePageManager } from './standalonePageManager';
import { ExperimentalFeaturesManager } from './experimental-features-manager';
import { ExtensionStatusManager } from './extension-status-manager';

const experimentalFeaturesToggle: HTMLInputElement | null =
  document.querySelector('#experimentalToggle');

if (!experimentalFeaturesToggle) {
  throw new Error('Expected #experimentalToggle element');
}

new StandalonePageManager(document).init();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
document
  .querySelector('[id="globalToggle"]')
  .addEventListener('change', async (event) => {
    const target = event.target as HTMLInputElement;
    chrome.storage.local.set({ enabled: target.checked }).catch(console.error);
    chrome.storage.local
      .set({ cacheInvalidate: Date.now() })
      .catch(console.error);
    // eslint-disable-next-line unicorn/no-null
    const allStorage = await chrome.storage.local.get(null);
    for (const x of Object.keys(allStorage).filter((x) => {
      return x.startsWith('cache[');
    })) {
      await chrome.storage.local.remove(x);
      continue;
    }

    if (target.checked) {
      ExtensionStatusManager.enable();
      experimentalFeaturesToggle.disabled = false;
    } else {
      ExtensionStatusManager.disable();
      ExperimentalFeaturesManager.disable();
      experimentalFeaturesToggle.disabled = true;
      experimentalFeaturesToggle.checked = false;
    }
  });

chrome.storage.local.get(['enabled'], (r) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  document.querySelector('[id="globalToggle"]').checked = r?.enabled ?? true;
  setTimeout(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete document
      .querySelector('[id="globalToggle"]')
      .classList.remove('noTransition');
  }, 50);
});

ExperimentalFeaturesManager.isEnabled()
  .then((isEnabled) => {
    experimentalFeaturesToggle.checked = isEnabled;
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch(console.error);

experimentalFeaturesToggle.addEventListener('change', (event) => {
  const toggle = event.currentTarget as HTMLInputElement;

  if (toggle.checked) {
    ExperimentalFeaturesManager.enable();
  } else {
    ExperimentalFeaturesManager.disable();
  }
});
