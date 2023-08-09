export function lowerFirst(string_) {
    return string_.charAt(0).toLowerCase() + string_.slice(1);
}

export const regPh = /^(\+\(?\d{1,4}\s?)\)?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
export const regM = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
export const regT = /^@[a-zA-Z0-9_]{1,15}$/;

export const customTwitterAccounts = {
    '1': {
        customHeader: "Donate on Gitcoin",  // Displayed at the top of the widget
        customText: "Help make web3 more usable for everyone by donating even a small amount to our gitcoin grant 💚", // subtitle
        buttonValue: "Donate", // Value displayed on CTA button
        hostURL: "https://gitcoin.co/grants/7233/idriss-a-better-way-to-interact-in-web3?", // forwarding url, potentially carrying additional params
        recipient: "@Gitcoin",  // recipient in url param
        forwardRecipient: false, // boolean if recipient should be forwarded in url
        recipientAddress: null, // recipient address dict, will filter unmentioned networks
        showNetworkSelection: false, // show selection of networks available for tipping
        showValueSelection: false, // show selection of amount including free text
        showTokenSelection: false, // allow token selection
        showInput: false, // Show additional free text input field
        showMessageBox: false, // forward message to recipient
        tokenFilter: null, // filter token and networks
        networkFilter: null,
        iconUrl: "default" // if icon is custom, add it to img folder and use "img/iconName.png", otherwise use "default"
    },
   "856446453157376003": {
        "customHeader": "Donate on Gitcoin",
        "customText": "Support Public Goods by contributing to the matching pool 💚",
        "buttonValue": "Donate",
        "hostURL": "https://idriss.xyz/send?",
        "recipient": "@Gitcoin",
        "forwardRecipient": true,
        "recipientAddress": {
            "ETH": "0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6"
        },
        "showNetworkSelection": true,
        "showValueSelection": true,
        "showTokenSelection": true,
        "showInput": false,
        "showMessageBox": false,
        "tokenFilter": {
            "network": ["ETH"]
        },
        "networkFilter": null,
        "iconUrl": "img/customGitcoin.png"
    },
};

let freshCustomTwitter = customTwitterAccounts

async function fetchCustomTwitter() {
  try {
  // ToDo: change url
    const response = await fetch('https://raw.githubusercontent.com/idriss-crypto/browser-extensions/master/src/common/customTwitterAccounts.json');
    const data = await response.json();
    freshCustomTwitter = data;
  } catch (error) {
    freshCustomTwitter = customTwitterAccounts;
  }
}

export function getCustomTwitter() {
  return freshCustomTwitter;
}

fetchCustomTwitter();
// Automatic fetching every 5 minutes
const fetchInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
setInterval(fetchCustomTwitter, fetchInterval);
