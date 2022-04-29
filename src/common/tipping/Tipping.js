import template from "mpts-loader!./tippingComponentTemplate.mpts"
import css from "!!css-loader!sass-loader!./tippingStyle.scss";
import {create} from "fast-creator";

export class Tipping {
    constructor(identifier) {
        this.div = document.createElement('div')
        this.div.attachShadow({mode: 'open'})
        this.div.shadowRoot.append(create('style', {text: css}));
        this.div.shadowRoot.append(template({identifier}));
    }
}
