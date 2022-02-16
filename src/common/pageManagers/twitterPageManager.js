import {AbstractPageManager} from "./abstractPageManager";

export class TwitterPageManager extends AbstractPageManager {
    static namesResults = {};

    constructor(document) {
        super(document)
    }

    async init() {
        console.log('searchPlaces')
        this.iconUrl = await this.getIcon()
        this.searchPlaces()
        addEventListener('load', () => this.searchPlaces())
        addEventListener('focus', () => this.searchPlaces())
        setInterval(()=>this.searchPlaces(), 2000);
    }

    searchPlaces() {
        const places = Array.from(this.listPlaces());
        const names = new Set(places.map(x => x.name).filter(x => x));
        this.getInfo(names);
        for (const place of places) {
            TwitterPageManager.namesResults[place.name].then(x => {
                place.addCallback(x);
            })
        }
    }

    getInfo(names) {
        const lacking = Array.from(names).filter(x => !TwitterPageManager.namesResults[x]);
        if (lacking.length > 0) {
            const promise = this.apiCall(lacking);
            for (const name of lacking) {
                TwitterPageManager.namesResults[name] = promise.then(x => x[name]);
            }
        }
    }

    apiCall(names) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: "apiBulkAddressesRequest",
                value: Object.fromEntries(names.map(x => ([x, {coin: "", network: ""}])))
            }, response => {
                resolve(response);
            });
        });
    }

    getIcon() {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: "getIconUrl"
            }, response => {
                resolve(response);
            });
        });
    }

    * listPlaces() {
        for (const div of document.querySelectorAll('div.r-dnmrzs.r-1ny4l3l')) {
            if (div.querySelector('.idrissIcon')) continue;
            const name = div.querySelector('.r-9ilb82')?.textContent;//r-18u37iz r-1wbh5a2
            const addCallback = data => {
                if (Object.values(data).length > 0 && !div.querySelector('.idrissIcon')) {
                    const icon = document.createElement('div');
                    icon.className = 'idrissIcon';
                    icon.style.width = '1.1em';
                    icon.style.height = '1.1em';
                    icon.style.margin = '0 0.3em';
                    icon.style.background = `url(${this.iconUrl}) no-repeat`;
                    icon.style.backgroundSize = `contain`;
                    icon.setAttribute('tabindex', '-1')
                    const dropdown = document.createElement('div');
                    icon.append(dropdown);
                    div.querySelector('.r-1fmj7o5').append(icon)
                    icon.onclick = e => {
                        e.stopPropagation();
                        e.preventDefault();

                        let dropdown = this.document.createElement('div');
                        this.document.body.append(dropdown);
                        let rect = icon.getBoundingClientRect()
                        dropdown.style.position = 'absolute';
                        dropdown.style.left = rect.left + 'px';
                        dropdown.style.top = rect.top + rect.height + 'px';
                        dropdown.style.width = rect.width + 'px';
                        dropdown.style.minWidth = '400px';
                        dropdown.style.zindex = 1000000;

                        this.lastDropdown?.remove();
                        this.lastDropdown=dropdown
                        this.generatePopupContent(dropdown, name, data, (value) => {
                            navigator.clipboard.writeText(value)
                            let lastPopup = this.lastDropdown;
                            setTimeout(() => lastPopup?.remove(), 100);
                        })
                        icon.onblur=()=>{
                            setTimeout(() => dropdown.remove(), 100);
                        }
                    }
                }
            }
            if (name) {
                yield {name, addCallback};
            }
        }
    }
}