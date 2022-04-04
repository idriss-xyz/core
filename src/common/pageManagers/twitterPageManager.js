import {AbstractPageManager} from "./abstractPageManager";
import {RequestLimiter} from "../RequestLimiter";

export class TwitterPageManager extends AbstractPageManager {
    static namesResults = {};

    constructor(document) {
        super(document)
    }

    async init() {
        this.requestLimiter = new RequestLimiter([{amount: 10, time: 1000}]);
        this.iconUrl = await this.getIcon()
        this.check()
        addEventListener('load', () => this.check())
        addEventListener('focus', () => this.check())
        addEventListener('popstate', () => this.check())
        addEventListener('click', () => setTimeout(() => this.check(), 250))
        addEventListener('click', () => this.lastDropdown?.remove())
        setInterval(() => this.check(), 2000);
    }

    async check() {
        if (await this.isEnabled()) {
            this.searchPlaces();
        } else {
            Array.from(document.querySelectorAll('.idrissIcon')).forEach(x => x.remove());
        }
        this.checkGarbageDropdown();
    }

    searchPlaces() {
        const places = Array.from(this.listPlaces());
        const names = new Set(places.map(x => x.name).filter(x => x));
        this.getInfo(names);
        for (const place of places) {
            TwitterPageManager.namesResults[place.name].then(x => {
                place.addCallback(x?.result ?? {});
            })
        }
    }

    checkGarbageDropdown() {
        const selector = '.idrissIcon:focus, .idrissIcon:hover, .idrissDropdown:hover, .idrissDropdown:focus';
        if (!document.querySelector(selector)) {
            setTimeout(() => {
                if (!document.querySelector(selector)) {
                    this.lastDropdown?.remove();
                }
            }, 500);
        }
    }

    getInfo(names) {
        const lacking = Array.from(names).filter(x => !TwitterPageManager.namesResults[x]);
        for (const name of lacking) {
            TwitterPageManager.namesResults[name] = this.apiCall(name);
        }
    }

    apiCall(name) {
        return this.requestLimiter.schedule(() => {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    type: "apiAddressesRequest",
                    value: name
                }, response => {
                    resolve(response);
                });
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
            const name = Array.from(div.querySelectorAll('.r-9ilb82, .r-14j79pv, .r-rjixqe')).map(x => x.textContent).find(x => x[0] == '@');
            let existingIcon = div.querySelector('.idrissIcon');
            if (existingIcon) {
                if (existingIcon.dataset.sourceName == name) {
                    return;
                } else {
                    existingIcon.remove()
                    existingIcon = null
                }
            }
            const addCallback = data => {
                if (Object.values(data).length > 0 && !data.error && !div.querySelector('.idrissIcon')) {
                    const icon = document.createElement('div');
                    icon.className = 'idrissIcon';
                    icon.dataset.sourceName = name;
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
                    div.querySelector('.r-1fmj7o5:not(h2), .r-18jsvk2:not(h2), .r-1nao33i:not(h2)')?.append(icon)
                    icon.onmouseover = e => {
                        e.stopPropagation();
                        e.preventDefault();

                        let dropdown = this.document.createElement('div');
                        this.document.body.append(dropdown);
                        let rect = icon.getBoundingClientRect()
                        dropdown.classList.add('idrissDropdown')
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

                        dropdown.onmouseout = () => {
                            setTimeout(() => dropdown.remove(), 100);
                        }

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