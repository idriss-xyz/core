import { SendToAnyoneMain } from "@idriss-crypto/send-to-anyone-core/subpages";
import css from "@idriss-crypto/send-to-anyone-core/sendToAnyoneStyle";
import { create } from "fast-creator";

export class TippingUnregistered {
  data;
  container;
  popup;
  name;

  constructor(data, name) {
    this.data = data;
    this.name = name;
    this.initContainer();
    this.initPopup();
  }

  initContainer() {
    this.container = document.createElement("div");
    this.container.attachShadow({ mode: "open" });
    this.container.shadowRoot.append(create("style", { text: css }));
  }

  initPopup() {
    this.popup = create("section.sendToAnyone-popup");
    this.container.shadowRoot.append(this.popup);
    this.popup.onclick = e => { e.preventDefault(); e.stopPropagation(); }
    this.popup.append(new SendToAnyoneMain(this.name, false, []).html);
    this.popup.addEventListener('sendMoney', async (e) => {
      let params = {
          recipient: this.data['Public ETH'] ?? Object.values(this.data)[0],
          identifier: this.name,
          tippingValue: e.amount,
          network: e.network,
          token: e.token,
          back:'close'
      }
      window.open(`https://www.idriss.xyz/send?` + Object.entries(params).map(x => encodeURIComponent(x[0]) + '=' + encodeURIComponent(x[1])).join('&'))
  })
  }
}
