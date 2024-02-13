export function lowerFirst(string_) {
    return string_.charAt(0).toLowerCase() + string_.slice(1);
}

export const regPh = /^(\+\(?\d{1,4}\s?)\)?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
export const regM = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
export const regT = /^@[a-zA-Z0-9_]{1,15}$/;
export const ERC1155_ABI = [{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_id","type":"uint256"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
export const MULTIRESOLVER_ABI = [{"inputs":[{"internalType":"string[]","name":"hashes","type":"string[]"}],"name":"getMultipleIDriss","outputs":[{"components":[{"internalType":"string","name":"hash","type":"string"},{"internalType":"string","name":"result","type":"string"}],"internalType":"struct IDrissWrapperContract.IDrissResult[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"}];
export const SBT_ADDRESS = "0x3803856585A7fbC6A3bCa94A0b9C49a48af90DD3";
export const MULTIRESOLVER_ADDRESS = "0xd7F1f92079B8c2563D8989aD4d08ca8BFA602Ca7"

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
        iconUrl: "img/icon148_red.png" // if icon is custom, add it to img folder and use "img/iconName.png", otherwise use "default"
    },
   "856446453157376003": {
        "customHeader": "Donate to Gitcoin",
        "customText": "",
        "buttonValue": "Donate",
        "hostURL": "https://www.idriss.xyz/send?",
        "recipient": "@Gitcoin",
        "forwardRecipient": true,
        "recipientAddress": {
            "optimism":  "0x0cC7a824B8760b426c597BbF997524DE0cad9988",
            "pgn":  "0x555277050AF4F7A11DB559d5ca1E4C4833a4Dbdd"
        },
        "showNetworkSelection": true,
        "showValueSelection": true,
        "showTokenSelection": true,
        "showInput": false,
        "showMessageBox": false,
        "tokenFilter": {
            "network": ["optimism", "pgn"]
        },
        "networkFilter": null,
        "iconUrl": "img/customGitcoin.png"
    },
};

export const walletTags = {
    evm: {
        ETH: {
            "Metamask ETH": "5d181abc9dcb7e79ce50e93db97addc1caf9f369257f61585889870555f8c321",
            "Binance ETH": "4b118a4f0f3f149e641c6c43dd70283fcc07eacaa624efc762aa3843d85b2aba",
            "Coinbase ETH": "92c7f97fb58ddbcb06c0d5a7cb720d74bc3c3aa52a0d706e477562cba68eeb73",
            "Exchange ETH": "ec72020f224c088671cfd623235b59c239964a95542713390a2b6ba07dd1151c",
            "Private ETH": "005ba8fbc4c85a25534ac36354d779ef35e0ee31f4f8732b02b61c25ee406edb",
            "Essentials ETH": "3ea9415b82f0ee7db933aab0be377ee1c1a405969d8b8c2454bcce7372a161c2",
            "Rainbow ETH": "992335db5f54ef94a5f23be8b925ed2529b044537c19b59643d39696936b6d6c",
            "Argent ETH": "682614f9b037714bbf001db3a8d6e894fbdcf75cbbb9dea5a42edce33e880072",
            "Tally ETH": "f368de8673a59b860b71f54c7ba8ab17f0b9648ad014797e5f8d8fa9f7f1d11a",
            "Trust ETH": "df3d3f0233e396b2b27c3943269b10ecf2e7c1070a485e1b6b8f2201cb23cb52",
            "Public ETH": "9306eda974cb89b82c0f38ab407f55b6d124159d1fa7779f2e088b2b786573c1",
        },
        BNB: {
            "Metamask BNB": "3bee8eefc6afe6b4f7dbcc024eb3ad4ceaa5e458d34b7877319f2fe9f676e983",
            "Essentials BNB": "639c9abb5605a14a557957fa72e146e9abf727be32e5149dca377b647317ebb9",
        },
        USDT: {
            "Metamask USDT": "74a3d8986c81769ed3bb99b773d66b60852f7ee3fa0d55a6a144523116c671c1",
            "Binance USDT": "77c27c19cc85e24b1d4650800cc4b1bc607986dd3e78608435cececd31c35015",
            "Coinbase USDT": "f2faabf9d133f31a13873ba8a15e676e063a730898ffadfcb0077f723260f563",
            "Exchange USDT": "683e7b694b374ce0d81ba525361fa0c27fff7237eb12ec41b6e225449d5702b9",
            "Private USDT": "8c9a306a7dc200c52d32e3c1fcbf2f65e8037a68127b81807e8e58428004bc57",
            "Essentials USDT": "74dcb573a5c63382484f597ae8034a6153c011e291c01eb3da40e9d83c436a9a",
        },
        USDC: {
            "Metamask USDC": "6f763fea691b1a723ef116e98c02fae07a4397e1a2b4b4c749d06845fa2ff5e4",
            "Binance USDC": "7d2b0e0ee27a341da84ce56e95eb557988f9d4ff95fe452297fc765265bb27a2",
            "Coinbase USDC": "6fe7c1a2fdd154e0b35283598724adee9a5d3b2e6523787d8b6de7cd441f15ca",
            "Exchange USDC": "8c4a231c47a4cfa7530ba4361b6926da4acd87f569167b8ba55b268bf99640d0",
            "Private USDC": "54c9da06ab3d7c6c7f813f36491b22b7f312ae8f3b8d12866d35b5d325895e3e",
            "Essentials USDC": "23a66df178daf25111083ee1610fb253baf3d12bd74c6c2aae96077558e3737a",
        },
        ELA: {
            "Essentials ELA SC": "c17c556467fe7c9fe5667dde7ca8cdbca8a24d0473b9e9c1c2c8166c1f355f6c",
        },
        MATIC: {
            "Essentials MATIC": "336fb6cdd7fec196c6e66966bd1c326072538a94e700b8bc1111d1574b8357ba",
        },
        ERC20: {
            ERC20: "63d95e64e7caff988f97fdf32de5f16624f971149749c90fbc7bbe44244d3ced",
        },
    },
    btc: {
        BTC: {
            "Binance BTC": "450efeca15651e50995ed494ac24a945e61d67f60bed0dbb3b2d8d7df122a8ca",
            "Coinbase BTC": "b3c77df93f865dd21a6196266d5c291adad15c7db9c81ddc78409a22f36ebe84",
            "Exchange BTC": "a3f104cace8d66ed9971b19f749a821ae4397349155ea1a8724451c3e680335b",
            "Private BTC": "a7d3f51b26dad11f5f4842d29f2fc419a48e3471bdec0a2c713c7d18d3143d65",
            "Essentials BTC": "39d18497a64591bb1b061940309c453495398d00f9d9deab8b2c1e0979e4cbe7",
        },
        ELA: {
            "Essentials ELA": "35ae820c72397977701524ee610e7ef2ca3d64539ccdc65e5198470d8e49eccb",
        },
    },
    sol: {
        SOL: {
            "Solana SOL": "62994eac84217f90c44d7acf962861f044a5f2e653400c154a8bcbf114da16fb",
            "Coinbase SOL": "b5a72b6402de8a0fa649e23c81ae165dcfcce22c960a4a67a218243a73f49b1f",
            "Trust SOL": "70190458e6435ad1e8f575ac60a7d8542ae5a4927aba336789de377a47b839d4",
            "Binance SOL": "19cd4e6feb1efb40eb6506fb448a22cefeb63690ecaa35fee65914607adee606",
            "Phantom SOL": "88f5c6ddb68a1cee77543f2de2788ade913b87bbac1c38d354707bc8ee3a0328",
        },
    },
};

export const priorityTags = {
            evm: {
                ETH: {
                    "Public ETH": "9306eda974cb89b82c0f38ab407f55b6d124159d1fa7779f2e088b2b786573c1",
                    "Metamask ETH": "5d181abc9dcb7e79ce50e93db97addc1caf9f369257f61585889870555f8c321",
                    "Binance ETH": "4b118a4f0f3f149e641c6c43dd70283fcc07eacaa624efc762aa3843d85b2aba",
                    "Rainbow ETH": "992335db5f54ef94a5f23be8b925ed2529b044537c19b59643d39696936b6d6c",
                    "Argent ETH": "682614f9b037714bbf001db3a8d6e894fbdcf75cbbb9dea5a42edce33e880072",
                    "Tally ETH": "f368de8673a59b860b71f54c7ba8ab17f0b9648ad014797e5f8d8fa9f7f1d11a",
                    "Trust ETH": "df3d3f0233e396b2b27c3943269b10ecf2e7c1070a485e1b6b8f2201cb23cb52",
                    "Argent ETH": "682614f9b037714bbf001db3a8d6e894fbdcf75cbbb9dea5a42edce33e880072",
                    "Essentials ETH": "3ea9415b82f0ee7db933aab0be377ee1c1a405969d8b8c2454bcce7372a161c2",
                    "Coinbase ETH": "92c7f97fb58ddbcb06c0d5a7cb720d74bc3c3aa52a0d706e477562cba68eeb73",
                    "Exchange ETH": "ec72020f224c088671cfd623235b59c239964a95542713390a2b6ba07dd1151c",
                },
                ERC20: {
                    ERC20: "63d95e64e7caff988f97fdf32de5f16624f971149749c90fbc7bbe44244d3ced",
                },
                BNB: {
                    "Metamask BNB": "3bee8eefc6afe6b4f7dbcc024eb3ad4ceaa5e458d34b7877319f2fe9f676e983",
                    "Essentials BNB": "639c9abb5605a14a557957fa72e146e9abf727be32e5149dca377b647317ebb9",
                },
                USDC: {
                    "Metamask USDC": "6f763fea691b1a723ef116e98c02fae07a4397e1a2b4b4c749d06845fa2ff5e4",
                    "Binance USDC": "7d2b0e0ee27a341da84ce56e95eb557988f9d4ff95fe452297fc765265bb27a2",
                    "Coinbase USDC": "6fe7c1a2fdd154e0b35283598724adee9a5d3b2e6523787d8b6de7cd441f15ca",
                    "Exchange USDC": "8c4a231c47a4cfa7530ba4361b6926da4acd87f569167b8ba55b268bf99640d0",
                    "Essentials USDC": "23a66df178daf25111083ee1610fb253baf3d12bd74c6c2aae96077558e3737a",
                },
                USDT: {
                    "Metamask USDT": "74a3d8986c81769ed3bb99b773d66b60852f7ee3fa0d55a6a144523116c671c1",
                    "Binance USDT": "77c27c19cc85e24b1d4650800cc4b1bc607986dd3e78608435cececd31c35015",
                    "Coinbase USDT": "f2faabf9d133f31a13873ba8a15e676e063a730898ffadfcb0077f723260f563",
                    "Exchange USDT": "683e7b694b374ce0d81ba525361fa0c27fff7237eb12ec41b6e225449d5702b9",
                    "Essentials USDT": "74dcb573a5c63382484f597ae8034a6153c011e291c01eb3da40e9d83c436a9a",
                },
                ELA: {
                    "Essentials ELA SC": "c17c556467fe7c9fe5667dde7ca8cdbca8a24d0473b9e9c1c2c8166c1f355f6c",
                },
                MATIC: {
                    "Essentials MATIC": "336fb6cdd7fec196c6e66966bd1c326072538a94e700b8bc1111d1574b8357ba",
                },

            }
        }

let freshCustomTwitter = customTwitterAccounts

async function fetchCustomTwitter() {
  try {
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

export function deviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
}

fetchCustomTwitter();
// Automatic fetching every 5 minutes
const fetchInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
setInterval(fetchCustomTwitter, fetchInterval);
