import {AbstractPageManager} from "./abstractPageManager";
import {RequestLimiter} from "../RequestLimiter";

export class EtherscanPageManager extends AbstractPageManager {
    async init() {
        this.check()
        addEventListener('load', () => this.check())
        addEventListener('focus', () => this.check())
        addEventListener('popstate', () => this.check())
        addEventListener('click', () => setTimeout(() => this.check(), 250))
        setInterval(() => this.check(), 2000);
    }


    findPlacesForReverseResolve() {
        let ret = super.findPlacesForReverseResolve();
        const selector='#mainaddress, .hash-tag, #contractCopy, #addressCopy, a[href^="/address/"]';
        for (const element of this.document.querySelectorAll(selector)) {
            if (element.classList.contains('idrissReverseResolved')) continue;
            if(element.querySelector(selector)) continue;//has another element inside
            let address = element.textContent;
            if (/^0x[0-9a-fA-F]{40}$/.test(address)) {
                ret.push({address, callback:x => this.defaultReverseResolve(x, element)})
            }
        }
        return ret;
    }

}