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
        addEventListener('load', () => this.check())
        addEventListener('focus', () => this.check())
        addEventListener('click', () => this.lastDropdown?.remove())
        setInterval(() => this.check(), 2000);
    }

    check() {
        this.searchPlaces();
        this.checkGarbageDropdown();
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

    checkGarbageDropdown() {
        if (!document.querySelector('.idrissIcon:focus')) {
            this.lastDropdown?.remove();
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
        for (const div of document.querySelectorAll('div.r-dnmrzs.r-1ny4l3l, .r-gtdqiz .css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci, .css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1pi2tsx.r-1777fci')) {
            if (div.querySelector('.idrissIcon')) continue;
            const name = div.querySelector('.r-9ilb82, .r-14j79pv')?.textContent;//r-18u37iz r-1wbh5a2
            const addCallback = data => {
                if (Object.values(data).length > 0 && !data.error && !div.querySelector('.idrissIcon')) {
                    const icon = document.createElement('div');
                    icon.className = 'idrissIcon';
                    icon.style.width = '1.1em';
                    icon.style.height = '1.1em';
                    icon.style.margin = '-1px 0 -1px 0';
                    icon.style.borderTop = '2px solid transparent';
                    icon.style.borderbottom = '2px solid transparent';
                    icon.style.borderLeft = '0.3em solid transparent';
                    icon.style.borderRight = '0.3em solid transparent';
                    icon.style.background = `url(${this.iconUrl}) no-repeat`;
                    icon.style.backgroundSize = `contain`;
                    icon.onmouseover = e => e.stopPropagation();
                    icon.setAttribute('tabindex', '-1')
                    const dropdown = document.createElement('div');
                    icon.append(dropdown);
                    div.querySelector('.r-1fmj7o5:not(h2), .r-18jsvk2:not(h2)').append(icon)
                    icon.onclick = e => {
                        e.stopPropagation();
                        e.preventDefault();

                        let dropdown = this.document.createElement('div');
                        this.document.body.append(dropdown);
                        let rect = icon.getBoundingClientRect()
                        console.log({rect, PAR: icon.offsetParent});
                        dropdown.style.position = 'fixed';
                        dropdown.style.left = rect.left + 'px';
                        dropdown.style.top = rect.top + rect.height + 'px';
                        dropdown.style.width = rect.width + 'px';
                        dropdown.style.minWidth = '400px';
                        dropdown.style.zindex = 1000000;

                        this.lastDropdown?.remove();
                        this.lastDropdown = dropdown
                        this.generatePopupContent(dropdown, name, data, (value) => {
                            navigator.clipboard.writeText(value)
                            let lastPopup = this.lastDropdown;
                            setTimeout(() => lastPopup?.remove(), 100);
                        })
                        const eventCallback = () => {
                            setTimeout(() => dropdown.remove(), 100);
                            removeEventListener('scroll', eventCallback)
                        };
                        icon.onblur = eventCallback
                        addEventListener('scroll', eventCallback)
                    }
                }
            }
            if (name) {
                yield {name, addCallback};
            }
        }
    }
}