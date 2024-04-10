import { ServiceWorker } from 'infrastructure/service-worker';

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
  chrome.contextMenus.onClicked.addListener(() => {
    chrome.windows
      .create({
        url: '/standalone.html',
        width: 450,
        height: 640,
        type: 'popup',
      })
      .catch(console.error);
  });
  chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
    const isActive =
      Boolean(tab.url?.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')) ||
      Boolean(tab.url?.includes('hnfanknocfeofbddgcijnmhnfnkdnaad')) ||
      Boolean(tab.url?.includes('bfnaelmomeimhlpmgjnjophhpkkoljpa')) ||
      Boolean(tab.url?.includes('eajafomhmkipbjmfmhebemolkcicgfmd')) ||
      Boolean(tab.url?.includes('bhhhlbepdkbapadjdnnojkbgioiodbic')) ||
      Boolean(tab.url?.includes('bgpipimickeadkjlklgciifhnalhdjhe')) ||
      Boolean(tab.url?.includes('fhbohimaelbohpjbbldcngcnapndodjp')) ||
      Boolean(tab.url?.includes('aiifbnbfobpmeekipheeijimdpnlpgpp')) ||
      Boolean(tab.url?.includes('ogcmjchbmdichlfelhmceldndgmgpcem')) ||
      Boolean(tab.url?.includes('hmeobnfnfcmdkdcmlblgagmfpfboieaf')) ||
      Boolean(tab.url?.includes('dlcobpjiigpikoobohmabehhmhfoodbb')) ||
      Boolean(tab.url?.includes('fnjhmkhhmkbjkkabndcnnogagogbneec)'));
    chrome.action.setIcon(
      { path: isActive ? 'img/icon16.png' : 'img/icon16bw.png', tabId },
      () => {
        /* ... */
      },
    );
  });
};

ServiceWorker.run(chrome, onInstalled);
