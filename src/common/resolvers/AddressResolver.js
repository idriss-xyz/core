import { TwitterIdResolver } from "./TwitterIdResolver";

import { lowerFirst, getCustomTwitter, regM, regPh, regT, priorityTags, walletTags, MULTIRESOLVER_ABI, MULTIRESOLVER_ADDRESS } from "../utils";
const { IdrissCrypto } = require("idriss-crypto/cjs/browser");
import { Web3 } from 'web3';


if (globalThis.window != globalThis) {
    globalThis.window = globalThis;
}

class AddressResolverClass extends IdrissCrypto {
    constructor(rpc="https://polygon-rpc.com/") {
        super(rpc);
        this.web3 = new Web3(rpc);
        this.multiResolver = new this.web3.eth.Contract(MULTIRESOLVER_ABI, MULTIRESOLVER_ADDRESS);
    }

    async get(identifier, coin = "", network = "") {
        if (identifier.match(regT)) {
            let twitterId = await TwitterIdResolver.get(identifier);
            if (!identifier || identifier == "Not found") {
                throw new Error("Twitter handle not found.");
            }
            return await this.simpleResolve(identifier, coin, network, twitterId);
        } else {
            return await this.simpleResolve(identifier, coin, network);
        }
    }

    async getMany(identifiers, coin = "", network = "") {
        let twitterNames = identifiers.filter((x) => x.match(regT));
        let twitterIds = [];
        if (twitterNames.length > 0) {
            twitterIds = await TwitterIdResolver.getMany(twitterNames);
        }
        let promises = [];
        for (let identifier of identifiers) {
            // use separate simpleResolve call for twitter page manager `apiAddressesRequestBulk`
            promises.push(this.simpleResolveTwitter(identifier, coin, network, twitterIds[identifier] ?? null));
        }
        let ret = {};
        for (let promise of promises) {
            try {
                ret[(await promise).input] = await promise;
            } catch (ex) {
//                ret[identifier] = {"input": identifier, "result": {}, "twitterID": null}
            }
        }
        return ret;
    }

    convertPhone(string_) {
        // allow for letters because secret word can follow phone number
        return "+" + string_.replace(/[^\da-zA-Z]/, "");
    }

    async digestMessage(message) {
        const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
        return hashHex;
    }

    // create a separate copy-paste call for extension window context and twitter page manager `apiAddressesRequestBulk`
    async simpleResolve(identifier, coin = "", network = "", twitterId) {
        console.log("resolveStart", identifier, twitterId);
        let twitterID;
        let identifierT;
        identifier = lowerFirst(identifier).replace(" ", "");
        if (identifier.match(regPh)) {
            identifier = this.convertPhone(identifier);
        } else if (!identifier.match(regM) && !identifier.match(regT)) {
            throw new Error("Not a valid input. Input must start with valid phone number, email or @twitter handle.");
        }
        if (identifier.match(regT)) {
            identifierT = identifier;
            identifier = twitterId;
            if (!identifier || identifier == "Not found") {
                throw new Error("Twitter handle not found.");
            }
            twitterID = true;
        }

        let digestedPromises = {};
        for (let [network_, coins] of Object.entries(walletTags)) {
            if (network && network_ != network) continue;
            for (let [coin_, tags] of Object.entries(coins)) {
                if (coin && coin_ != coin) continue;
                for (let [tag_, tag_key] of Object.entries(tags)) {
                    if (tag_key) {
                        digestedPromises[tag_] = await this.digestMessage(identifier + tag_key);
                    }
                }
            }
        }

        const digestedMessages = Object.values(digestedPromises);

        const resolvedPromises = await this.makeApiCallBatch(digestedMessages);

        let foundMatches = {};

        resolvedPromises.forEach(obj => {
            if (obj.result && obj.result !== "") {
                const hashKey = Object.keys(digestedPromises).find(key => digestedPromises[key] === obj.hash);
                if (hashKey) {
                    foundMatches[hashKey] = obj.result;
                }
            }
        });

        if (twitterID) {
            return { input: identifierT, result: foundMatches, twitterID: identifier };
        } else {
            return { input: identifier, result: foundMatches };
        }
    }

    async simpleResolveTwitter(identifier, coin = "", network = "", twitterId) {
        console.log("resolveStart for Twitter", identifier);
        let twitterID;
        let identifierT;
        identifier = lowerFirst(identifier).replace(" ", "");
        if (identifier.match(regPh)) {
            identifier = this.convertPhone(identifier);
        } else if (!identifier.match(regM) && !identifier.match(regT)) {
            throw new Error("Not a valid input. Input must start with valid phone number, email or @twitter handle.");
        }
        if (identifier.match(regT)) {
            identifierT = identifier;
            identifier = twitterId;
            if (!identifier || identifier == "Not found") {
                throw new Error("Twitter handle not found.");
            }
            twitterID = true;
            let customTwitterAccounts = getCustomTwitter();
            // custom dropdowns on twitter
            if (customTwitterAccounts[identifier]) {
                let foundMatches = {};
                foundMatches[identifierT] = customTwitterAccounts[identifier];
                return { input: identifierT, result: foundMatches, twitterID: identifier };
            }
        }

        let digestedPromises = {};
        for (let [network_, coins] of Object.entries(priorityTags)) {
            if (network && network_ != network) continue;
            for (let [coin_, tags] of Object.entries(coins)) {
                if (coin && coin_ != coin) continue;
                for (let [tag_, tag_key] of Object.entries(tags)) {
                    if (tag_key) {
                        digestedPromises[tag_] = await this.digestMessage(identifier + tag_key);
                    }
                }
            }
        }

        const digestedMessages = Object.values(digestedPromises);

        const resolvedPromises = await this.makeApiCallBatch(digestedMessages);

        let foundMatches = {};

        resolvedPromises.forEach(obj => {
            if (obj.result && obj.result !== "") {
                const hashKey = Object.keys(digestedPromises).find(key => digestedPromises[key] === obj.hash);
                if (hashKey) {
                    foundMatches[hashKey] = obj.result;
                } else{console.log("no match", hashKey, obj.result, obj.hash)}
            }
        });

        if (twitterID) {
            return { input: identifierT, result: foundMatches, twitterID: identifier };
        } else {
            return { input: identifier, result: foundMatches };
        }
    }

    async makeApiCallBatch(digestedArray) {
        return await this.multiResolver.methods.getMultipleIDriss(digestedArray).call();
    }

    async getManyReverse(value) {
        return Object.fromEntries(await Promise.all(value.map(async (x) => [x, await this.reverseResolve(x)])));
    }
}

export const AddressResolver = new AddressResolverClass();
