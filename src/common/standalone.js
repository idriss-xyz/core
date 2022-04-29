import {StandalonePageManager} from "./pageManagers/standalonePageManager";

(new StandalonePageManager(document, document.url)).init()
document.querySelector('[type="checkbox"]').onchange = e => {
    chrome.storage.local.set({'enabled': e.target.checked})
    chrome.storage.local.set({'cacheInvalidate': new Date()})
}
chrome.storage.local.get(['enabled'], r => {
    document.querySelector('[type="checkbox"]').checked = r?.enabled ?? true;
    setTimeout(() => {
        delete document.querySelector('[type="checkbox"]').classList.remove('noTransition');
    }, 50);
})