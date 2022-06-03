import {AdressesResolver} from "../common/resolvers/AdressesResolver";
import {lowerFirst, regT} from "../common/utils";
import {TwitterIdResolver} from "../common/resolvers/TwitterIdResolver";
import {TippingLogic} from "../common/tipping/TippingLogic";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === 'apiAddressesRequest') {
            AdressesResolver.get(request.value).then(x => sendResponse(x)).catch(e => sendResponse({}));
            return true;
        } else if (request.type === 'apiAddressesRequestBulk') {
            AdressesResolver.getMany(request.value, '', request.network??'').then(x => sendResponse(x)).catch(e => sendResponse({}));
            return true;
        } else if (request.type === 'getIconUrl') {
            fetch(chrome.runtime.getURL('img/icon148.png'))
                .then(fetchRequest => fetchRequest.blob())
                .then(blob => readBlob(blob))
                .then(x => sendResponse(x));
            return true;
        } else if (request.type === 'prepareTip') {
            TippingLogic.prepareTip(request.value.chain, request.value.coin, request.value.address, request.value.amountUSD).then(x => sendResponse(x));
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

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: 'Open IDriss',
        contexts: ["page"],
        id: "idriss-crypto-1",
        documentUrlPatterns: ["chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/*", "chrome-extension://hnfanknocfeofbddgcijnmhnfnkdnaad/*", "chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/*", "chrome-extension://eajafomhmkipbjmfmhebemolkcicgfmd/*", "chrome-extension://bhhhlbepdkbapadjdnnojkbgioiodbic/*", "chrome-extension://bgpipimickeadkjlklgciifhnalhdjhe/*", "chrome-extension://fhbohimaelbohpjbbldcngcnapndodjp/*", "chrome-extension://aiifbnbfobpmeekipheeijimdpnlpgpp/*", "chrome-extension://ogcmjchbmdichlfelhmceldndgmgpcem/*", "chrome-extension://hmeobnfnfcmdkdcmlblgagmfpfboieaf/*", "chrome-extension://dlcobpjiigpikoobohmabehhmhfoodbb/*", "chrome-extension://fnjhmkhhmkbjkkabndcnnogagogbneec/*"]
    });
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        chrome.windows.create({url: '/standalone.html', width: 450, height: 640, type: 'popup'})
    })
    chrome.tabs.onUpdated.addListener(async (tabId, _, tab) => {
        let isActive = tab.url.includes("nkbihfbeogaeaoehlefnkodbefgpgknn") || tab.url.includes("hnfanknocfeofbddgcijnmhnfnkdnaad") || tab.url.includes("bfnaelmomeimhlpmgjnjophhpkkoljpa") || tab.url.includes("eajafomhmkipbjmfmhebemolkcicgfmd") || tab.url.includes("bhhhlbepdkbapadjdnnojkbgioiodbic") || tab.url.includes("bgpipimickeadkjlklgciifhnalhdjhe") || tab.url.includes("fhbohimaelbohpjbbldcngcnapndodjp") || tab.url.includes("aiifbnbfobpmeekipheeijimdpnlpgpp") || tab.url.includes("ogcmjchbmdichlfelhmceldndgmgpcem") || tab.url.includes("hmeobnfnfcmdkdcmlblgagmfpfboieaf") || tab.url.includes("dlcobpjiigpikoobohmabehhmhfoodbb") || tab.url.includes("fnjhmkhhmkbjkkabndcnnogagogbneec")
        chrome.action.setIcon({path: isActive ? "img/icon16.png" : "img/icon16bw.png", tabId}, () => { /* ... */
        });
    })
});