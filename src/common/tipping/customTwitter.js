import css from "@idriss-crypto/tipping-core/tippingStyle";
import {create} from "fast-creator";
import {FrameworkDapp} from "@idriss-crypto/tipping-core/subpages";


export class CustomTwitter {
    constructor(data) {
        this.div = document.createElement('div')
        this.div.attachShadow({mode: 'open'})
        this.div.shadowRoot.append(create('style', {text: css}));

        let popup = create('section.tipping-popup')
        this.div.shadowRoot.append(popup);

        popup.append(new FrameworkDapp(data).html);
        popup.addEventListener('customEvent', async (e) => {
            console.log({e, data})
            let params = {
                amount: e.amount ?? null,
                network: e.network ?? null,
                token: e.token ?? null,
                message: e.message ?? null,
                input: e.input ?? null,

                back:'close'
            }
            window.open(data['hostURL'] + Object.entries(params).filter(([k, v]) => v).map(x => encodeURIComponent(x[0]) + '=' + encodeURIComponent(x[1])).join('&'))
        })
    }
}
