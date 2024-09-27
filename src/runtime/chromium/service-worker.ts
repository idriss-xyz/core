import { ServiceWorker } from 'infrastructure/service-worker';
// eslint-disable-next-line boundaries/element-types
import { ACTIVE_TAB_CHANGED, EXTENSION_BUTTON_CLICKED } from 'shared/extension';

const keepAlive = () => {
  return setInterval(chrome.runtime.getPlatformInfo, 20e3);
};

const isValidTab = (
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

/*  Chromium Wallets
    nkbihfbeogaeaoehlefnkodbefgpgknn - MetaMask
    hnfanknocfeofbddgcijnmhnfnkdnaad - Coinbase
    bfnaelmomeimhlpmgjnjophhpkkoljpa - Phantom
    eajafomhmkipbjmfmhebemolkcicgfmd - Tally
    bhhhlbepdkbapadjdnnojkbgioiodbic - Solflare
    bgpipimickeadkjlklgciifhnalhdjhe - GeroWallet
    fhbohimaelbohpjbbldcngcnapndodjp - Binance Wallet
    aiifbnbfobpmeekipheeijimdpnlpgpp - TerraStation Wallet
    ogcmjchbmdichlfelhmceldndgmgpcem - Bob Extension
    hmeobnfnfcmdkdcmlblgagmfpfboieaf - XDEFI Wallet
    dlcobpjiigpikoobohmabehhmhfoodbb - Argent X StarkNet Wallet
    fnjhmkhhmkbjkkabndcnnogagogbneec - Ronin Wallet
*/
const onInstalled = () => {
  chrome.contextMenus.create({
    title: 'Open IDriss',
    contexts: ['page'],
    id: 'idriss-crypto-1',
    documentUrlPatterns: [
      'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/*',
      'chrome-extension://hnfanknocfeofbddgcijnmhnfnkdnaad/*',
      'chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/*',
      'chrome-extension://eajafomhmkipbjmfmhebemolkcicgfmd/*',
      'chrome-extension://bhhhlbepdkbapadjdnnojkbgioiodbic/*',
      'chrome-extension://bgpipimickeadkjlklgciifhnalhdjhe/*',
      'chrome-extension://fhbohimaelbohpjbbldcngcnapndodjp/*',
      'chrome-extension://aiifbnbfobpmeekipheeijimdpnlpgpp/*',
      'chrome-extension://ogcmjchbmdichlfelhmceldndgmgpcem/*',
      'chrome-extension://hmeobnfnfcmdkdcmlblgagmfpfboieaf/*',
      'chrome-extension://dlcobpjiigpikoobohmabehhmhfoodbb/*',
      'chrome-extension://fnjhmkhhmkbjkkabndcnnogagogbneec/*',
    ],
  });

  chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (isValidTab(activeTab)) {
        chrome.tabs
          .sendMessage(activeTab.id, {
            type: ACTIVE_TAB_CHANGED,
          })
          .catch(console.error);
      }
    });
  });

  chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (isValidTab(activeTab)) {
        chrome.tabs
          .sendMessage(activeTab.id, {
            type: EXTENSION_BUTTON_CLICKED,
          })
          .catch(console.error);
      }
    });
  });
};
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();

ServiceWorker.run(chrome, onInstalled);
