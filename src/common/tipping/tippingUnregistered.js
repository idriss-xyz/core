import css from "@idriss-crypto/tipping-core/tippingStyle";
import { create } from "fast-creator";
import { FrameworkDapp } from "@idriss-crypto/tipping-core/subpages";
import { SendToAnyoneAddress } from "@idriss-crypto/send-to-anyone-core/subpages";

export class TippingUnregistered {
  data;
  container;
  popup;

  constructor(data) {
    this.data = data;
    this.initContainer();
    this.initPopup();
  }

  initContainer() {
    this.container = document.createElement("div");
    this.container.attachShadow({ mode: "open" });
    this.container.shadowRoot.append(create("style", { text: css }));
  }

  initPopup() {
    this.popup = create("section.tipping-popup");
    this.container.shadowRoot.append(this.popup);

    this.popup.append(new SendToAnyoneAddress().html);
    // popup.addEventListener("customEvent", async (e) => {
    //   console.log({ e, data });
    //   let params = {
    //     amount: e.amount ?? null,
    //     network: e.network ?? null,
    //     token: e.token ?? null,
    //     message: e.message ?? null,
    //     input: e.input ?? null,

    //     back: "close",
    //   };
    //   window.open(
    //     data["hostURL"] +
    //       Object.entries(params)
    //         .filter(([k, v]) => v)
    //         .map(
    //           (x) => encodeURIComponent(x[0]) + "=" + encodeURIComponent(x[1])
    //         )
    //         .join("&")
    //   );
    // });
  }
}
