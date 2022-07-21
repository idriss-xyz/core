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

    check() {
        this.findReverseResolve();
    }

    async findReverseResolve() {
        let places=this.findPlacesForReverseResolve();
        let addresses = places.map(x => x.address);
        if (addresses.length > 0) {
            let resp = await this.reverseResolveRequest(addresses)
            console.log(resp);
            for (const place of places) {
                if(resp[place.address]){
                    place.callback(resp[place.address])
                }
            }
        }
    }

    findPlacesForReverseResolve() {
        let ret = super.findPlacesForReverseResolve();
        for (const element of this.document.querySelectorAll('#mainaddress')) {
            if (element.classList.contains('idrissReverseResolved')) continue;
            let address = element.textContent;
            if (/^0x[0-9a-fA-F]{40}$/.test(address)) {
                ret.push({address, callback:x => this.defaultReverseResolve(x, element)})
            }
        }
        return ret;
    }

    defaultReverseResolve(x, element) {
        element.textContent = x;
    }
}