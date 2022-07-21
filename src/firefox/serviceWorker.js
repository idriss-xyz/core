import {AdressesResolver} from "../common/resolvers/AdressesResolver";


browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === 'apiAddressesRequest') {
            AdressesResolver.get(request.value).then(x => sendResponse(x)).catch(e => sendResponse({}));
            return true;
        } else if (request.type === 'apiAddressesRequestBulk') {
            AdressesResolver.getMany(request.value, '', request.network??'').then(x => sendResponse(x)).catch(e => sendResponse({}));
            return true;
        } else if (request.type === 'reverseResolveRequest') {
            AdressesResolver.getManyReverse(request.value).then(x => sendResponse(x)).catch(e => sendResponse({}));
            return true;
        } else if (request.type === 'getIconUrl') {
            fetch(chrome.runtime.getURL('img/icon148.png'))
                .then(fetchRequest => fetchRequest.blob())
                .then(blob => readBlob(blob))
                .then(x => sendResponse(x));
            return true;
        } else if (request.type === 'getTwitterIconUrl') {
            fetch(chrome.runtime.getURL('img/twitter.svg'))
                .then(fetchRequest => fetchRequest.blob())
                .then(blob => readBlob(blob))
                .then(x => sendResponse(x));
            return true;
        }
    }
);

function readBlob(b) {
    return new Promise(function (resolve, reject) {
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
    contexts: ["page"],
    id: "idriss-crypto-1",
    documentUrlPatterns: ["moz-extension://*/*"]
});
browser.contextMenus.onClicked.addListener((info, tab) => {
    browser.windows.create({url: '/standalone.html', width: 450, height: 640, type: 'popup'})
})
browser.tabs.onUpdated.addListener(async (tabId, _, tab) => {
    let isActive = tab.url.includes("f8447b2f-6dfc-45ef-acea-dbe7d9828659") || tab.url.includes("92744c8c-9eb2-4c22-8d0c-f0fb8a0bb9ca") || tab.url.includes("b40d9360-a5a5-43e5-928d-cbe6a73b66a1") || tab.url.includes("0b8be570-8dcc-4755-95b4-bb5da48fa031") || tab.url.includes("b7f2adfa-eee4-4e2e-a1dc-b6264f24087b")
    browser.action.setIcon({path: isActive ? "img/icon16.png" : "img/icon16bw.png", tabId}, () => { /* ... */
    });
})