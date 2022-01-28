chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === 'apiAddressesRequest') {
            fetch("https://www.idriss-crypto.com/v1/Addresses?InputCombination=" + encodeURIComponent(request.value))
                .then(fetchRequest => fetchRequest.json())
                .then(x => sendResponse(x));
            return true;
        }
    }
);
chrome.contextMenus.create({
    title: 'Open IDriss',
    contexts: ["page"],
    id: "idriss-crypto-1",
    documentUrlPatterns: ["chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/*", "chrome-extension://hnfanknocfeofbddgcijnmhnfnkdnaad/*"]
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.windows.create({url: '/popup.html', width: 450, height: 600, type: 'popup'})
})
chrome.tabs.onUpdated.addListener(async (tabId, _, tab) => {
    let isActive = tab.url.includes("nkbihfbeogaeaoehlefnkodbefgpgknn") || tab.url.includes("hnfanknocfeofbddgcijnmhnfnkdnaad")
    chrome.action.setIcon({path: isActive ? "img/icon16.png" : "img/icon16bw.png", tabId}, () => { /* ... */
    });
})