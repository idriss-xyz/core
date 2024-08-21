import css from "./popup.scss";

export class AbstractPageManager {

    constructor(document) {
        this.document = document;
        this.reverseKnownAddresses = {};
    }

    generatePopupContent(div, key, elements, callback) {
        div.attachShadow({mode: 'open'})
        let style = document.createElement('style')
        let addition;
        if (Object.values(elements).length > 3) {
            addition = (":host {max-height: 125px!important; overflow-y: auto!important; overflow-x: hidden!important;}");
        }
        style.textContent = css.toString() + addition;
        div.shadowRoot.append(style);
        if (Object.values(elements).length == 0) {
            let item = document.createElement('div')
            item.className = 'empty';
            item.append("Nothing found. ");
            let a = document.createElement('a')
            a.textContent = 'Sign up for IDriss now!';
            a.href = 'https://www.idriss.xyz';
            a.target = '_blank';
            item.append(a)
            div.shadowRoot.append(item)
        }
        for (const elementsKey in elements) {
            let item = document.createElement('div')
            let typeElement = document.createElement('div')
            typeElement.className = 'type'
            typeElement.textContent = elementsKey;
            item.append(typeElement)
            let keyElement = document.createElement('div')
            keyElement.className = 'key'
            keyElement.textContent = key;
            item.append(keyElement)
            if (key.startsWith("@")) {
                keyElement.style.color = "#1DA1F2";
                let imgElement = document.createElement('img')
                imgElement.src = "https://www.idriss.xyz/static/images/twitter.png"
                imgElement.alt = "Twitter"
                imgElement.className = 'img'
                imgElement.style.width = '2em';
                item.append(imgElement)
            }
            let valueElement = document.createElement('div')
            valueElement.className = 'value'
            valueElement.textContent = elements[elementsKey];
            item.append(valueElement)
            let tooltip = document.createElement('div')
            tooltip.className = 'tooltip'
            tooltip.textContent = "Copied address!";
            item.append(tooltip)
            div.shadowRoot.append(item)
            item.onmousedown = () => {
                callback(elements[elementsKey])
                tooltip.style.visibility = "visible";
                setTimeout(function () {
                    tooltip.style.visibility = "hidden";
                }, 1000);
            }
        }
    }

    apiCall(value) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({type: "apiAddressesRequest", value}, response => {
                resolve(response);
            });
        });
    }

    reverseResolveRequest(value) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({type: "reverseResolveRequest", value}, response => {
                resolve(response);
            });
        });
    }

    isEnabled() {
        return new Promise(r => chrome.storage.local.get(['enabled'], x => r(x?.enabled ?? true)))
    }

    /**
     * @virtual
     */
    findPlacesForReverseResolve() {
        return [];
    }

    /**
     * @virtual
     */
    check() {
        this.findReverseResolve();
    }

    async findReverseResolve() {
        let places = await this.findPlacesForReverseResolve();
        let addresses = places.map(x => x.address).filter(a => this.reverseKnownAddresses[a] === undefined);
        if (addresses.length > 0) {
            let resp = await this.reverseResolveRequest(addresses)
            this.reverseKnownAddresses = {...this.reverseKnownAddresses, ...resp}
        }
        for (const place of places) {
            if (this.reverseKnownAddresses[place.address]) {
                place.callback(this.reverseKnownAddresses[place.address])
            }
        }
    }

    async defaultReverseResolve(x, element) {
        if (element.classList.contains('idrissReverseResolved')) return;
        element.title = 'Resolved by IDriss from ' + element.textContent.trim();
        element.textContent = x;
        element.classList.add('idrissReverseResolved');
        if (x[0] == '@') {
            let link = this.document.createElement('a')
            link.href = "https://twitter.com/" + x.slice(1,);
            link.target = "_blank"
            if (document.location.hostname.endsWith('explorer.zksync.io')) link.style.margin = '2px 0 0 0';
            if (document.location.hostname.endsWith('blockscout.com') ||
            document.location.hostname.endsWith('explorer.linea.build') ||
            document.location.hostname.endsWith('evm-explorer.alephzero.org') ||
            document.location.hostname.endsWith('explorer.mantle.xyz')) link.style.margin = '6px 0 0 0';
            if (document.location.hostname.endsWith('explorer.goerli.linea.build') ||
                document.location.hostname.endsWith('blockscout.scroll.io')) {
                var sibling = element.nextElementSibling;
                if (sibling.matches('.d-md-inline-block.d-xl-none')) {
                    console.log("removing sibling")
                    sibling.remove()
                }
                element.classList.remove('d-none', 'd-md-none')
                element.classList.add('d-md-inline-block')
            };
            let img = this.document.createElement('img')
            img.src = await this.getTwitterIcon();
            img.alt = "Twitter";
            img.style.width = '1em';
            img.style.height = '1em';
            link.append(img)
            element.prepend(link)
        }
    }

    async getTwitterIcon() {
        if (this.twitterIcon) return this.twitterIcon
        return await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: "getTwitterIconUrl"
            }, response => {
                resolve(response);
                this.twitterIcon = response;
            });
        });
    }
}