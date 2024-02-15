import {StandalonePageManager} from "./pageManagers/standalonePageManager";

(new StandalonePageManager(document, document.url)).init()
document.querySelector('[id="globalToggle"]').onchange =async e => {
    chrome.storage.local.set({'enabled': e.target.checked})
    chrome.storage.local.set({'cacheInvalidate': +new Date()})
    const allStorage=await chrome.storage.local.get(null);
    Object.keys(allStorage).filter(x=>x.startsWith('cache[')).forEach(x=>chrome.storage.local.remove(x))
}
chrome.storage.local.get(['enabled'], r => {
    document.querySelector('[id="globalToggle"]').checked = r?.enabled ?? true;
    setTimeout(() => {
        delete document.querySelector('[id="globalToggle"]').classList.remove('noTransition');
    }, 50);
})