import css from "!!css-loader!sass-loader!./tippingStyle.scss";
import {create} from "fast-creator";
import {TippingWaitingApproval} from "./tippingWaitingApproval";
import {TippingMain} from "./tippingMain";
import {TippingWaitingConfirmation} from "./tippingWaitingConfirmation";
import {TippingSuccess} from "./tippingSuccess";
import {TippingLogic} from "./TippingLogic";
import Web3Modal from "web3modal"

export class Tipping {
    constructor(identifier) {
        this.div = document.createElement('div')
        this.div.attachShadow({mode: 'open'})
        this.div.shadowRoot.append(create('style', {text: css}));

        let popup = create('section.tipping-popup')
        this.div.shadowRoot.append(popup);
        popup.append(new TippingMain(identifier).html);
        popup.addEventListener('sendMoney', async (e) => {
            console.log({e})
            window.open(`https://www.idriss.xyz/tip/?identifier=${encodeURIComponent(identifier)}&recipent=0xb794f5ea0ba39494ce839613fffba74279579268&tippingValue=${e.amount}&network=${e.network}&token=${e.token}ETH&message=test`)
        })
    }
}
