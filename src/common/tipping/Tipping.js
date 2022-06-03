import css from "!!css-loader!sass-loader!./tippingStyle.scss";
import {create} from "fast-creator";
import {TippingMain} from "./tippingMain";


export class Tipping {
    constructor(identifier, data) {
        this.div = document.createElement('div')
        this.div.attachShadow({mode: 'open'})
        this.div.shadowRoot.append(create('style', {text: css}));

        let popup = create('section.tipping-popup')
        this.div.shadowRoot.append(popup);
        popup.append(new TippingMain(identifier).html);
        popup.addEventListener('sendMoney', async (e) => {
            console.log({e, data})
            let params = {
                recipent: data['Public ETH'] ?? Object.values(data)[0],
                identifier,
                tippingValue: e.amount,
                network: e.network,
                token: e.token
            }
            window.open(`https://www.idriss.xyz/tip/?` + Object.entries(params).map(x => encodeURIComponent(x[0]) + '=' + encodeURIComponent(x[1])).join('&'))
            //window.open(`http://localhost:8080/?` + Object.entries(params).map(x => encodeURIComponent(x[0]) + '=' + encodeURIComponent(x[1])).join('&'))
        })
    }
}
