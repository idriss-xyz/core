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
                identifier: data["forwardRecipient"] ? e.identifier : null,
                recipient: data['recipientAddress'] ? data['recipientAddress'][e.network] : null,
                network: data['showNetworkSelection'] ? e.network : null,
                assetType: data['showTokenSelection'] ? e.assetType : null,
                assetAddress: data['showTokenSelection'] ? e.assetAddress : null,
                tippingValue: data['showTokenSelection'] ? e.amount : null,
                token: data['showTokenSelection'] ? e.token : null,
                message: data['showMessageBox'] ? e.message : null,
                input: data['showInput'] ? e.input : null,
                back:'close'
            }
            window.open(data['hostURL'] + Object.entries(params).filter(([k, v]) => v).map(x => encodeURIComponent(x[0]) + '=' + encodeURIComponent(x[1])).join('&'))
        })
    }
}
