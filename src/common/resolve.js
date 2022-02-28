// load the smart contract the same way you did in the library

var walletTags = {
    evm: {
        ETH: {
            "Metamask ETH": "",
            "Binance ETH": "",
            "Coinbase ETH": "",
            "Exchange ETH": "",
            "Private ETH": "",
            "Essentials ETH": "",
            "Rainbow ETH": "",
            "Argent ETH": "",
            "Tally ETH": "f368de8673a59b860b71f54c7ba8ab17f0b9648ad014797e5f8d8fa9f7f1d11a",
            "Trust ETH": "",
            "Public ETH": "",
        },
        BNB: {
            "Metamask BNB": "",
            "Essentials BNB": "",
        },
        USDT: {
            "Metamask USDT": "",
            "Binance USDT": "",
            "Coinbase USDT": "",
            "Exchange USDT": "",
            "Private USDT": "",
            "Essentials USDT": "",
        },
        USDC: {
            "Metamask USDC": "",
            "Binance USDC": "",
            "Coinbase USDC": "",
            "Exchange USDC": "",
            "Private USDC": "",
            "Essentials USDC": "",
        },
        ELA: {
            "Essentials ELA SC": "",
        },
        TLOS: {
            "Essentials TLOS": "",
        },
        MATIC: {
            "Essentials MATIC": "",
        },
        LINK: {
            "Essentials LINK": "",
        },
        HT: {
            "Essentials HT": "",
        },
        FSN: {
            "Essentials FSN": "",
        },
        FTM: {
            "Essentials FTM": "",
        },
        AVAX: {
            "Essentials AVAX": "",
        },
        BTC: {
            "Essentials BTC": "",
        },
        ERC20: {
            ERC20: "",
        },
    },
    btc: {
        BTC: {
            "Binance BTC": "",
            "Coinbase BTC": "",
            "Exchange BTC": "",
            "Private BTC": "",
        },
        ELA: {
            "Essentials ELA": "",
        },
    },
    sol: {
        SOL: {
            "Solana SOL": "",
            "Coinbase SOL": "",
            "Trust SOL": "",
            "Binance SOL": "",
            "Phantom SOL": "",
        },
    },
};

const regPh = /^(\+\(?\d{1,4}\s?)\)?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
const regM = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const regT = /^@[^\s]+/;

function lowerFirst(string_) {
    return string_.charAt(0).toLowerCase() + string_.slice(1);
}

function convertPhone(string_) {
    // allow for letters because secret word can follow phone number
    return string_.replace(/[^\da-zA-Z]/, "")
}

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}


// call this function also for twitter plugin functionality?
export async function simpleResolve(identifier, coin="", network="") {
    let twitterID;
    let identifierT;
    let address;
    let foundMatches = {}
    identifier = lowerFirst(identifier).replace(" ", "");
    if (identifier.match(regPh)) {
        identifier = convertPhone(identifier)
    } else if (!identifier.match(regM) && !identifier.match(regT)) {
        return "Not a valid input. Input must start with valid phone number, email or @twitter handle." // return error
    }
    if (identifier.match(regT)) {
        // make API call to get twitter id
        identifierT = identifier;
        // endpoint: /v1/getTwitterID, method:GET
        identifier = 123 //api call here or custom twitter lookup, try catch block if twitter handle not found return error "Twitter handle not found"
    }
    if (network && coin) {
        for (let [tag, tag_key] of Object.values(walletTags[network][coin])) {
            address = await contract.methods.getIDriss(digestMessage(identifier.concat(tag_key)));
            if (address != "") {
                foundMatches[tag] = address
            }
        }
    }
    else if (network) {
        for (let [coin, tags] of Object.entries(walletTags[network])) {
            for (let [tag, tag_key] of Object.entries(tags)) {
                address = await contract.methods.getIDriss(digestMessage(identifier.concat(tag_key)));
                if (address != "") {
                    foundMatches[tag] = address
                }
            }
        }
    }
    else if (coin) {
        for (let [network, coins] of Object.entries(walletTags)) {
            for (let [coin_, tags] of Object.entries(coins)) {
                if (coin_ == coin) {
                    for (let [tag, tag_key] of Object.entries(tags)) {
                        address = await contract.methods.getIDriss(hashlib.sha256(identifier.concat(tag_key)));
                        if (address != "") {
                            foundMatches[tag] = address
                        }
                    }
                }
            }
        }
    }
    else {
        for (let [network, coins] of Object.entries(walletTags)) {
            for (let [coin, tags] of Object.entries(coins)) {
                for (let [tag, tag_key] of Object.entries(tags)) {
                    address = contract.functions.getIDriss(hashlib.sha256(identifier.concat(tag_key)));
                    if (address != "") {
                        foundMatches[tag] = address
                    }
                }
            }
        }
    }
    // return twitter id when twitter id was searched for
    if (twitterID) {
        return {"input": identifierT, "result": foundMatches, "twitterID": identifier}
    }
    else {
        return {"input": identifier, "result": foundMatches}
    }
    // catch block if coin/network (combination) is invalid/not found
}