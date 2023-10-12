import {TwitterIdResolver} from "./TwitterIdResolver";

import {lowerFirst, getCustomTwitter, regM, regPh, regT, priorityTags} from "../utils";
const {IdrissCrypto}= require("idriss-crypto/cjs/browser");

if (globalThis.window != globalThis) {
    globalThis.window = globalThis;
}

class AddressResolverClass extends IdrissCrypto {
    constructor() {
        super("https://polygon-rpc.com/");
        this.contract = this.generateIDrissRegistryContract();
    }

    async get(identifier, coin = "", network = "") {
        if (identifier.match(regT)) {
            let twitterId = await TwitterIdResolver.get(identifier);
            if (!identifier || identifier == "Not found") {
                throw new Error("Twitter handle not found.")
            }
            return await this.simpleResolve(identifier, coin, network, twitterId)
        } else {
            return await this.simpleResolve(identifier, coin, network)
        }
    }

    async getMany(identifiers, coin = "", network = "") {
        let twitterNames = identifiers.filter(x => x.match(regT));
        let twitterIds = [];
        if (twitterNames.length > 0) {
            twitterIds = await TwitterIdResolver.getMany(twitterNames)
        }
        let promises = [];
        for (let identifier of identifiers) {
        // use separate simpleResolve call for twitter page manager `apiAddressesRequestBulk`
            promises.push(this.simpleResolveTwitter(identifier, coin, network, twitterIds[identifier] ?? null))
        }
        let ret = {};
        for (let promise of promises) {
            try {
                ret[(await promise).input] = await promise;
            } catch (ex) {
                ret[identifier] = {"input": identifier, "result": {}, "twitterID": null}
            }
        }
        return ret;
    }

    convertPhone(string_) {
        // allow for letters because secret word can follow phone number
        return "+" + string_.replace(/[^\da-zA-Z]/, "")
    }

    async digestMessage(message) {
        const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        return hashHex;
    }

    // create a separate copy-paste call for extension window context and twitter page manager `apiAddressesRequestBulk`
    async simpleResolve(identifier, coin = "", network = "", twitterId) {
        console.log('resolveStart', identifier);
        let twitterID;
        let identifierT;
        identifier = lowerFirst(identifier).replace(" ", "");
        if (identifier.match(regPh)) {
            identifier = this.convertPhone(identifier)
        } else if (!identifier.match(regM) && !identifier.match(regT)) {
            throw new Error("Not a valid input. Input must start with valid phone number, email or @twitter handle.")
        }
        if (identifier.match(regT)) {
            identifierT = identifier;
            identifier = twitterId;
            if (!identifier || identifier == "Not found") {
                                 throw new Error("Twitter handle not found.")
            }
            twitterID = true;
            let customTwitterAccounts = getCustomTwitter();
            // custom dropdowns on twitter
            if (customTwitterAccounts[identifier]) {
                let foundMatches = {}
                foundMatches[identifierT] = customTwitterAccounts[identifier]
                return {"input": identifierT, "result": foundMatches, "twitterID": identifier}
            }
        }

        let foundMatchesPromises = {}
        for (let [network_, coins] of Object.entries(IdrissCrypto.getWalletTags())) {
            if (network && network_ != network) continue;
            for (let [coin_, tags] of Object.entries(coins)) {
                if (coin && coin_ != coin) continue;
                for (let [tag_, tag_key] of Object.entries(tags)) {
                    if (tag_key) {
                        foundMatchesPromises[tag_] = this.digestMessage(identifier + tag_key).then(digested => this.makeApiCall(digested));
                    }
                }
            }
        }
        console.log('resolve promise created', identifier, foundMatchesPromises);
        ///awaiting on the end for better performance
        let foundMatches = {}
        for (let [tag_, promise] of Object.entries(foundMatchesPromises)) {
            try {
                let address = await promise;
                if (address) {
                    foundMatches[tag_] = address;
                }
            } catch (e) {
                console.warn(e);
            }
        }
        console.log({identifierT, identifier, foundMatches})
        // return twitter id when twitter id was searched for
        if (twitterID) {
            return {"input": identifierT, "result": foundMatches, "twitterID": identifier}
        } else {
            return {"input": identifier, "result": foundMatches}
        }
        // catch block if coin/network (combination) is invalid/not found
    }

    async simpleResolveTwitter(identifier, coin = "", network = "", twitterId) {
        console.log('resolveStart for Twitter', identifier);
        let twitterID;
        let identifierT;
        identifier = lowerFirst(identifier).replace(" ", "");
        if (identifier.match(regPh)) {
            identifier = this.convertPhone(identifier)
        } else if (!identifier.match(regM) && !identifier.match(regT)) {
            throw new Error("Not a valid input. Input must start with valid phone number, email or @twitter handle.")
        }
        if (identifier.match(regT)) {
            identifierT = identifier;
            identifier = twitterId;
            if (!identifier || identifier == "Not found") {
                                 throw new Error("Twitter handle not found.")
            }
            twitterID = true;
            let customTwitterAccounts = getCustomTwitter();
            // custom dropdowns on twitter
            if (customTwitterAccounts[identifier]) {
                let foundMatches = {}
                foundMatches[identifierT] = customTwitterAccounts[identifier]
                return {"input": identifierT, "result": foundMatches, "twitterID": identifier}
            }
        }

        // adjust batch resolver size accordingly
        const batchSize = 3;
        let digestedMessages = [];

        for (let [network_, coins] of Object.entries(IdrissCrypto.getWalletTags())) {
            if (network && network_ != network) continue;
            for (let [coin_, tags] of Object.entries(coins)) {
                if (coin && coin_ != coin) continue;
                for (let [tag_, tag_key] of Object.entries(tags)) {
                    if (tag_key) {
                        const digested = this.digestMessage(identifier + tag_key);
                        digestedMessages.push({ tag: tag_, digested });
                    }
                }
            }
        }

        console.log('digested strings created', identifier, digestedMessages);
        ///awaiting on the end for better performance
        let foundMatches = {}
        for (let i = 0; i < digestedMessages.length; i += batchSize) {
            const batch = digestedMessages.slice(i, i + batchSize);

            const batchPromises = batch.map(({ tag, digested }) => ({
              tag,
              promise: this.makeApiCall(digested).then(address => address),
            }));

            for (let { tag, promise } of batchPromises) {
                try {
                    const address = await promise;
                    if (address) {
                        foundMatches[tag] = address;
                    }
                } catch (e) {
                    console.warn(e);
                }
            }
            console.log({identifierT, identifier, foundMatches})
            if (Object.keys(foundMatches).length > 0) {
                // return twitter id when twitter id was searched for
                if (twitterID) {
                    return {"input": identifierT, "result": foundMatches, "twitterID": identifier}
                } else {
                    return {"input": identifier, "result": foundMatches}
                }
            }
        }
        if (twitterID) {
            return {"input": identifierT, "result": {}, "twitterID": identifier}
        } else {
            return {"input": identifier, "result": {}}
        }
    }

    async makeApiCall(digested) {
        for (let i = 0; i < 10; i++) {
            try {
                return await (await this.contract).methods.getIDriss(digested).call()
            } catch (e) {
                console.log(e)
                if (e.code == 429) {
                    console.log("Rate limits, trying again")
                    await new Promise(r => setTimeout(r, Math.random() * 2000));
                } else {
                    throw e;
                }
            }
        }
    }

    async getManyReverse(value) {
     return Object.fromEntries(await Promise.all(value.map(async x=>[x,await this.reverseResolve(x)])));
    }
}

export const AddressResolver = new AddressResolverClass();