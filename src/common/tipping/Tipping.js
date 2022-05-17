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
        popup.addEventListener('sendMoney', async () => {
            popup.firstElementChild.remove();
            popup.append(new TippingWaitingApproval(identifier).html)
            console.log('ssssssssssssssss')
            const web3Modal = new Web3Modal({
                network: 'mainnet',
                cacheProvider: false, // optional
                providerOptions: TippingLogic.providerOptions, // required
                disableInjectedProvider: false,
            });
            await web3Modal.clearCachedProvider();
            let provider = await web3Modal.connect();
            setTimeout(() => {//dummy

                popup.firstElementChild.remove();
                popup.append(new TippingWaitingConfirmation(identifier).html)
            }, 5000)

            setTimeout(() => {//dummy

                popup.firstElementChild.remove();
                popup.append(new TippingSuccess(identifier).html)
            }, 10000)
        })
    }

}
