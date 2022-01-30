browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === 'apiAddressesRequest') {
            fetch("https://www.idriss-crypto.com/v1/Addresses?InputCombination=" + encodeURIComponent(request.value))
                .then(fetchRequest => fetchRequest.json())
                .then(x => sendResponse(x));
            return true;
        }
    }
);

/*  Firefox Wallets
    f8447b2f-6dfc-45ef-acea-dbe7d9828659 - MetaMask
    92744c8c-9eb2-4c22-8d0c-f0fb8a0bb9ca - Phantom
    b40d9360-a5a5-43e5-928d-cbe6a73b66a1 - Solflare
    0b8be570-8dcc-4755-95b4-bb5da48fa031 - Binance Wallet
*/


browser.contextMenus.create({
    title: 'Open IDriss',
    contexts: ["page"],
    id: "idriss-crypto-1",
    documentUrlPatterns: ["moz-extension://f8447b2f-6dfc-45ef-acea-dbe7d9828659/*", "moz-extension://92744c8c-9eb2-4c22-8d0c-f0fb8a0bb9ca/*", "moz-extension://b40d9360-a5a5-43e5-928d-cbe6a73b66a1/*", "moz-extension://0b8be570-8dcc-4755-95b4-bb5da48fa031/*"]
});
browser.contextMenus.onClicked.addListener((info, tab) => {
    chrome.windows.create({url: '/popup.html', width: 450, height: 600, type: 'popup'})
})
browser.tabs.onUpdated.addListener(async (tabId, _, tab) => {
    let isActive = tab.url.includes("f8447b2f-6dfc-45ef-acea-dbe7d9828659") || tab.url.includes("92744c8c-9eb2-4c22-8d0c-f0fb8a0bb9ca") || tab.url.includes("b40d9360-a5a5-43e5-928d-cbe6a73b66a1") || tab.url.includes("0b8be570-8dcc-4755-95b4-bb5da48fa031")
    browser.action.setIcon({path: isActive ? "img/icon16.png" : "img/icon16bw.png", tabId}, () => { /* ... */
    });
})