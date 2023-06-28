import css from "@idriss-crypto/send-to-anyone-core/sendToAnyoneStyle";
import {create} from "fast-creator";
import {CustomTwitter} from "@idriss-crypto/send-to-anyone-core/subpages";


export class CustomWidget {
    constructor(data) {
        this.div = document.createElement('div')
        this.div.attachShadow({mode: 'open'})
        this.div.shadowRoot.append(create('style', {text: css}));

        let popup = create('section.sendToAnyone-popup')
        this.div.shadowRoot.append(popup);
        popup.append(new CustomTwitter(data).html);
        popup.addEventListener('customEvent', async (e) => {
            console.log({e, data})
            let params = {
                identifier: e.identifier ?? null,
                recipient: data['recipient_address'] ?? null,
                network: e.network ?? null,
                assetType: e.assetType ?? null,
                assetAddress: e.assetAddress ?? null,
                tippingValue: e.amount ?? null,
                token: e.token ?? null,
                message: e.message ?? null,
                input: e.input ?? null,
                back:'close'
            }
            window.open(data['hostURL'] + Object.entries(params).filter(([k, v]) => v).map(x => encodeURIComponent(x[0]) + '=' + encodeURIComponent(x[1])).join('&'))
        })
    }
}
