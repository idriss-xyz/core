const { IdrissCrypto } = require("idriss-crypto/cjs/browser");
import Web3 from "web3";

if (globalThis.window != globalThis) {
    globalThis.window = globalThis;
}

export const SbtResolverClass = {

    constructor(rpc="https://mantle.publicnode.com") {
        
        provider = Web3.HTTPProvider(rpc)
        this.web3 = Web3(provider)
        this.contract = new this.web3.eth.Contract(
            SBT_ABI,
            SBT_ADDRESS
        );
    },

    async get(address) {
        await (await this.contract).methods.getIDriss(digested).call();
    },

    async makeApiCall(digested) {
        for (let i = 0; i < 10; i++) {
            try {
                return await (await this.contract).methods.getIDriss(digested).call();
            } catch (e) {
                if (e.code == 429) {
                    console.log("Rate limits, trying again");
                    await new Promise((r) => setTimeout(r, Math.random() * 2000));
                } else if (e.message.includes("Binding does not exist")) {
                    return // does not exist
                } else {
                    throw e;
                }
            }
        }
    }
}

export const AddressResolver = new AddressResolverClass();
