import { COMMAND_REQUEST, Command, CommandBus } from '../common/command-bus';
import { AddressResolver } from '../common/resolvers/AddressResolver';
import { SbtResolver } from '../common/resolvers/SbtResolver';

browser.runtime.onMessage.addListener(
  function (request, _sender, sendResponse) {
    if (request.type === COMMAND_REQUEST) {
      const command: Command = request.data;

      CommandBus.execute(command).then((res: unknown) => sendResponse(res));

      return true;
    }

    if (request.type === 'apiAddressesRequest') {
      AddressResolver.get(request.value)
        .then((x) => sendResponse(x))
        .catch(() => sendResponse({}));
      return true;
    } else if (request.type === 'apiAddressesRequestBulk') {
      AddressResolver.getMany(request.value, '', request.network ?? '')
        .then((x) => sendResponse(x))
        .catch(() => sendResponse({}));
      return true;
    } else if (request.type === 'reverseResolveRequest') {
      AddressResolver.getManyReverse(request.value)
        .then((x) => sendResponse(x))
        .catch(() => sendResponse({}));
      return true;
    } else if (request.type === 'sbtRequest') {
      SbtResolver.getSBT(request.value)
        .then((x) => sendResponse(x))
        .catch(() => sendResponse({}));
      return true;
    } else if (request.type === 'getIconUrl') {
      if (request.custom == '') {
        fetch(chrome.runtime.getURL('img/icon148.png'))
          .then((fetchRequest) => fetchRequest.blob())
          .then((blob) => readBlob(blob))
          .then((x) => sendResponse(x));
        return true;
      } else {
        fetch(chrome.runtime.getURL(request.custom))
          .then((fetchRequest) => fetchRequest.blob())
          .then((blob) => readBlob(blob))
          .then((x) => sendResponse(x));
        return true;
      }
    } else if (request.type === 'getTwitterIconUrl') {
      fetch(chrome.runtime.getURL('img/twitter.svg'))
        .then((fetchRequest) => fetchRequest.blob())
        .then((blob) => readBlob(blob))
        .then((x) => sendResponse(x));
      return true;
    }
    return true;
  },
);

function readBlob(b: Blob) {
  return new Promise(function (resolve) {
    const reader = new FileReader();
    reader.onloadend = function () {
      resolve(reader.result);
    };
    reader.readAsDataURL(b);
  });
}

/*  Firefox Wallets
    f8447b2f-6dfc-45ef-acea-dbe7d9828659 - MetaMask
    92744c8c-9eb2-4c22-8d0c-f0fb8a0bb9ca - Phantom
    b40d9360-a5a5-43e5-928d-cbe6a73b66a1 - Solflare
    0b8be570-8dcc-4755-95b4-bb5da48fa031 - Binance Wallet
    b7f2adfa-eee4-4e2e-a1dc-b6264f24087b - Ronin Wallet
*/

browser.contextMenus.create({
  title: 'Open IDriss',
  contexts: ['page'],
  id: 'idriss-crypto-1',
  documentUrlPatterns: ['moz-extension://*/*'],
});
browser.contextMenus.onClicked.addListener(() => {
  browser.windows.create({
    url: '/standalone.html',
    width: 450,
    height: 640,
    type: 'popup',
  });
});
browser.tabs.onUpdated.addListener(async (tabId, _, tab) => {
  const isActive =
    tab.url?.includes('f8447b2f-6dfc-45ef-acea-dbe7d9828659') ||
    tab.url?.includes('92744c8c-9eb2-4c22-8d0c-f0fb8a0bb9ca') ||
    tab.url?.includes('b40d9360-a5a5-43e5-928d-cbe6a73b66a1') ||
    tab.url?.includes('0b8be570-8dcc-4755-95b4-bb5da48fa031') ||
    tab.url?.includes('b7f2adfa-eee4-4e2e-a1dc-b6264f24087b');
  browser.action.setIcon(
    { path: isActive ? 'img/icon16.png' : 'img/icon16bw.png', tabId },
    () => {
      /* ... */
    },
  );
});
