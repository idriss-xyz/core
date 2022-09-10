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
        showNetworkSelection: false,
        showValueSelection: false,
        showTokenSelection: false,
        showInput: false,
        showMessageBox: false,
        tokenFilter: null,
        networkFilter: null,
    },
};

