import { StandalonePageManager } from './standalonePageManager';
import { ExperimentalFeaturesSettingsManager } from './experimentalFeaturesSettingsManager';

const experimentalFeaturesToggle: HTMLInputElement | null =
  document.querySelector('#experimentalToggle');

if (!experimentalFeaturesToggle) {
  throw new Error('Expected #experimentalToggle element');
}

new StandalonePageManager(document).init();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
document.querySelector('[id="globalToggle"]').onchange = async (e) => {
  chrome.storage.local.set({ enabled: e.target.checked });
  chrome.storage.local.set({ cacheInvalidate: +new Date() });
  const allStorage = await chrome.storage.local.get(null);
  Object.keys(allStorage)
    .filter((x) => x.startsWith('cache['))
    .forEach((x) => chrome.storage.local.remove(x));

  if (e.target.checked) {
    if (experimentalFeaturesToggle.checked) {
      ExperimentalFeaturesSettingsManager.enable();
    }
    experimentalFeaturesToggle.disabled = false;
  } else {
    ExperimentalFeaturesSettingsManager.disable();
    experimentalFeaturesToggle.disabled = true;
    experimentalFeaturesToggle.checked = false;
  }
};

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

ExperimentalFeaturesSettingsManager.isEnabled().then((isEnabled) => {
  experimentalFeaturesToggle.checked = isEnabled;
});

experimentalFeaturesToggle.addEventListener('change', (e) => {
  const toggle = e.currentTarget as HTMLInputElement;

  if (toggle.checked) {
    ExperimentalFeaturesSettingsManager.enable();
  } else {
    ExperimentalFeaturesSettingsManager.disable();
  }
});
