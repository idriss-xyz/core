export function lowerFirst(string_) {
    return string_.charAt(0).toLowerCase() + string_.slice(1);
}

export const regPh = /^(\+\(?\d{1,4}\s?)\)?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
export const regM = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
export const regT = /^@[a-zA-Z0-9_]{1,15}$/;

export const customTwitterAccounts = {
    '856446453157376003': {
        customHeader: "Donate on Gitcoin",
        customText: "Help make web3 more usable for everyone by donating even a small amount to our gitcoin grant 💚",
        buttonValue: "Donate",
        hostURL: "https://gitcoin.co/grants/7233/idriss-a-better-way-to-interact-in-web3?",
        recipient: "@Gitcoin",
        forwardRecipient: false,
        recipientAddress: null,
        showNetworkSelection: false,
        showValueSelection: false,
        showTokenSelection: false,
        showInput: false,
        showMessageBox: false,
        tokenFilter: null,
        networkFilter: null,
    },
//    '1470315931142393857': {
//        customHeader: "Donate to @JediSwap",
//        customText: "IDriss test funding round",
//        buttonValue: "Donate",
//        hostURL: "https://idriss.xyz/send?",
//        recipient: "@JediSwap",
//        forwardRecipient: true,
//        recipientAddress: {"ETH": "0x1", "Polygon": "0x2", "BSC": "0x3", "zkSync": "0x4"},
//        showNetworkSelection: true,
//        showValueSelection: true,
//        showTokenSelection: true,
//        showInput: false,
//        showMessageBox: false,
//        tokenFilter: {"network": ["ETH", "Polygon", "zkSync"]},
//        networkFilter: null,
//    },
};

let freshCustomTwitter = customTwitterAccounts

async function fetchCustomTwitter() {
  try {
  // ToDo: change url
    const response = await fetch('https://raw.githubusercontent.com/idriss-crypto/browser-extensions/custom-twitter/src/common/customTwitterAccounts.json');
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
