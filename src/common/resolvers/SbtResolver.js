import { Web3 } from 'web3';

import {ERC1155_ABI, SBT_ADDRESS} from "../utils";

if (globalThis.window != globalThis) {
    globalThis.window = globalThis;
}

export const SbtResolver = {

    init(rpc="https://mantle.publicnode.com") {
        const web3 = new Web3(rpc)
        const contract = new web3.eth.Contract(
            ERC1155_ABI,
            SBT_ADDRESS            
        );
        return contract;
    },
    
    async getSBT(address) {
        const contract = this.init()
        try {    
            const balance = await contract.methods.balanceOf(address, 1).call();
            return balance > 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
            
