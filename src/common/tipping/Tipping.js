import css from "!!css-loader!sass-loader!./tippingStyle.scss";
import {create} from "fast-creator";


export class Tipping {
    constructor(identifier) {
        this.div = document.createElement('div')
        this.div.attachShadow({mode: 'open'})
        this.div.shadowRoot.append(create('style', {text: css}));

let popup=create('section.tipping-popup')
        this.div.shadowRoot.append(popup);
        popup.append(new TippingMain(identifier).html);

    }

}
