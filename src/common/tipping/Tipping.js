import template from "mpts-loader!./tippingComponentTemplate.mpts"
import css from "!!css-loader!sass-loader!./tippingStyle.scss";
import {create} from "fast-creator";
import eth_logo from "!!url-loader!../img/eth_logo.png"
import usdc_logo from "!!url-loader!../img/usdc_logo.png"
import arrow from "!!url-loader!../img/arrow.svg"
import pen from "!!url-loader!../img/pen.svg"

export class Tipping {
    constructor(identifier) {
        this.div = document.createElement('div')
        this.div.attachShadow({mode: 'open'})
        this.div.shadowRoot.append(create('style', {text: css}));
        console.log({identifier, eth_logo})
        this.div.shadowRoot.append(template({identifier, eth_logo, usdc_logo, arrow, pen}));
    }
}
