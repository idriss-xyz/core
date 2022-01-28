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
browser.contextMenus.create({
    title: 'Open IDriss',
    contexts: ["page"],
    id: "idriss-crypto-1",
    documentUrlPatterns: ["moz-extension://f8447b2f-6dfc-45ef-acea-dbe7d9828659/*"]
});
browser.contextMenus.onClicked.addListener((info, tab) => {
    chrome.windows.create({url: '/popup.html', width: 450, height: 600, type: 'popup'})
})
browser.tabs.onUpdated.addListener(async (tabId, _, tab) => {
    let isActive = tab.url.includes("f8447b2f-6dfc-45ef-acea-dbe7d9828659")
    browser.action.setIcon({path: isActive ? "img/icon16.png" : "img/icon16bw.png", tabId}, () => { /* ... */
    });
})