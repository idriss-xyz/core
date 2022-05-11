import css from "!!css-loader!sass-loader!./tippingStyle.scss";
import {create} from "fast-creator";
import {TippingWaitingApproval} from "./tippingWaitingApproval";
import {TippingMain} from "./tippingMain";


export class Tipping {
    constructor(identifier) {
        this.div = document.createElement('div')
        this.div.attachShadow({mode: 'open'})
        this.div.shadowRoot.append(create('style', {text: css}));

        let popup = create('section.tipping-popup')
        this.div.shadowRoot.append(popup);
        popup.append(new TippingMain(identifier).html);
        popup.addEventListener('sendMoney',()=>{
            popup.firstElementChild.remove();
            popup.append(new TippingWaitingApproval().html)
        })
    }

}
