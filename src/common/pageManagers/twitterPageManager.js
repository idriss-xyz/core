import {AbstractPageManager} from "./abstractPageManager";
import {RequestLimiter} from "../RequestLimiter";
import {Tipping} from "../tipping/Tipping";
import {TippingUnregistered} from '../tipping/tippingUnregistered'
import {CustomWidget} from "../tipping/customTwitter";
import {getCustomTwitter} from "../utils";

export class TwitterPageManager extends AbstractPageManager {
    static namesResults = {};

    constructor(document) {
        super(document)
            }

    async init() {
      console.log("Starting init")
        this.requestLimiter = new RequestLimiter([{amount: 10, time: 1000}]);
        console.log("Getting icon now")
        this.iconUrl = await this.getIcon();
        console.log("Running init")
        this.sbtIconUrl = await this.getIcon("img/sbt.png");
        console.log("Running init after getting sbt")
        let customTwitterAccounts = await getCustomTwitter();

        const entriesWithIcons = Object.entries(customTwitterAccounts).filter(([, value]) =>
          value.iconUrl && value.iconUrl !== "" && value.iconUrl !== "default"
        );
        const icons = await Promise.all(entriesWithIcons.map(([, value]) => this.getIcon(value.iconUrl)));

        this.allIcons = entriesWithIcons.reduce((acc, [, value], index) => ((acc[value.iconUrl] = icons[index]), acc), {});

        this.allIcons.default = this.iconUrl;

        this.check()
        addEventListener('load', () => this.check())
        addEventListener('focus', () => this.check())
        addEventListener('popstate', () => this.check())
        addEventListener('click', () => setTimeout(() => this.check(), 250))
        addEventListener('click', e => {
            if (!e.path?.includes(this.lastDropdown)) this.lastDropdown?.remove();
        });
        setInterval(() => this.check(), 2000);
    }

    async check() {
        console.log("Check called")
        super.check();
        if (await this.isEnabled()) {
            this.searchPlaces();
        } else {
            Array.from(document.querySelectorAll('.idrissIcon')).forEach(x => x.remove());
        }
        this.checkGarbageDropdown();
    }

    async searchPlaces() {
      console.log("Searching places")
        const places = Array.from(this.listPlaces());
        const names = new Set(places.map(x => x.name).filter(x => x));
        await this.getInfo(names);
        for (const place of places) {
            TwitterPageManager.namesResults[place.name].then(x => {
                place.addCallback(x?.result ?? {});
            })
        }
    }

    checkGarbageDropdown() {
        const selector = '.idrissIcon:focus, .idrissIcon:hover, .idrissTwitterDropdown:hover, .idrissTwitterDropdown:focus, .idrissTwitterDropdown.isClicked';
        if (!document.querySelector(selector)) {
            setTimeout(() => {
                if (!document.querySelector(selector)) {
                    this.lastDropdown?.remove();
                    //this.lastDropdown = null;
                }
            }, 500);
        }
    }

    async getInfo(names) {
        const lacking = Array.from(names).filter(x => !TwitterPageManager.namesResults[x]);
        if (lacking.length == 0) return

        let requestPromise = this.apiCall(lacking);

        for (const name of lacking) {
            TwitterPageManager.namesResults[name] = requestPromise.then(d => d[name]);
        }
        await requestPromise;
    }

    async apiCall(names) {
        let responses = await this.requestLimiter.scheduleMany(names, (x) => {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    type: "apiAddressesRequestBulk",
                    value: x,
                    network: 'evm'
                }, response => {
                    resolve(response);
                });
            });
        });
        return responses.reduce((a, b) => ({...a, ...b}));
    }

    async checkSBT(address) {
      if (!address) return false;
      console.log(address)
      try {
          return new Promise((resolve, reject) => {
              chrome.runtime.sendMessage({ type: "sbtRequest", value: address }, response => {
                  if (chrome.runtime.lastError) {
                      reject(new Error(chrome.runtime.lastError.message));
                  } else if (response && response.error) {
                      reject(new Error(response.error));
                  } else {
                      resolve(response);
                  }
              });
          });
      } catch (error) {
          console.error('Error in checkSBT:', error);
          return false;
      }
    }
      

    getIcon(_custom="") {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: "getIconUrl",
                custom: _custom
            }, response => {
                resolve(response);
            });
        });
    }

    * listPlaces() {
        for (const div of document.querySelectorAll('div.r-dnmrzs.r-1ny4l3l, .r-gtdqiz .css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci, .css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1pi2tsx.r-1777fci')) {
            if (div.matches('.css-1dbjc4n.r-xoduu5.r-1wbh5a2.r-dnmrzs.r-1ny4l3l')) continue;
            const name = Array.from(div.querySelectorAll('.r-9ilb82, .r-14j79pv, .r-rjixqe, .r-1b43r93.r-hjklzo')).map(x => x.textContent).find(x => x[0] == '@');
            if(!name) continue;
            let existingIcon = div.querySelector('.idrissIcon');
            if (existingIcon) {
                if (existingIcon.dataset.sourceName == name) {
                    continue;
                } else {
                    existingIcon.remove()
                    existingIcon = null
                }
            }
            const addCallback = (data) => {
              if (!data.error && !div.querySelector(".idrissIcon")) {
                if (Object.values(data).length === 0) {
                  const dropdownContent = new TippingUnregistered(data, name).container;
                  const { icon } = this.createIcon(div, data, dropdownContent, name);
                  icon.style.filter = `grayscale(100%)`;
                } else {
                // create icon based on param here
                  const dropdownContent = data[name]
                    ? new CustomWidget(data[name]).div
                    : new Tipping(name, data).div;
                  this.createIcon(div, data, dropdownContent, name);
                }
              }
            };
            if (name) {
                yield {name, addCallback};
            }
        }
    }

    createIconStyling = (url, className, name) => {
      const tempIcon = this.document.createElement('div');
      tempIcon.className = className;
      tempIcon.dataset.sourceName = name;
      tempIcon.style.width = "1.1em";
      tempIcon.style.height = "1.1em";
      tempIcon.style.margin = "-1px 0 -1px 0";
      tempIcon.style.borderTop = "2px solid transparent";
      tempIcon.style.borderbottom = "2px solid transparent";
      tempIcon.style.borderLeft = "0.3em solid transparent";
      tempIcon.style.borderRight = "0.3em solid transparent";
      let _iconUrl = url;
      tempIcon.style.background = `url(${_iconUrl}) no-repeat`;
      tempIcon.style.backgroundSize = `contain`;
      return tempIcon
    }

    createIcon = async (parent, data, dropdownContent, name) => {
      const sbtIcon = this.createIconStyling(this.sbtIconUrl, "sbtIcon", "MJ-SBT");
      let _iconUrl = data[name] ? this.allIcons[data[name].iconUrl] : this.allIcons.default;
      let iconClassName = "idrissIcon"
      const icon = this.createIconStyling(_iconUrl, iconClassName, name);
      icon.onmouseover = (e) => e.stopPropagation();
      icon.setAttribute("tabindex", "-1");
      const dropdown = document.createElement("div");
      icon.append(dropdown);
      let appendingElem = parent
        .querySelector(
          ".r-adyw6z.r-135wba7.r-1vr29t4.r-1awozwy.r-6koalj, .r-bcqeeo.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-b88u0q.r-1awozwy, .r-1b6yd1w.r-7ptqe7.r-1vr29t4.r-1awozwy.r-6koalj, .r-bcqeeo.r-qvutc0.r-37j5jr.r-1b43r93.r-hjklzo.r-b88u0q.r-1awozwy"
        )
      appendingElem?.append(icon);
      // console.log("check sbt", await this.checkSBT(Object.values(data)[0]))
      if (await this.checkSBT(Object.values(data)[0])) appendingElem?.append(sbtIcon);
      icon.onmouseover = (e) => {
      e.stopPropagation();
      e.preventDefault();
      let dropdown = dropdownContent;
      dropdown.addEventListener("click", (e) => e.stopPropagation());
        this.document.body.append(dropdown);
        let rect = icon.getBoundingClientRect();
        dropdown.classList.add("idrissTwitterDropdown");
        dropdown.style.all = "initial";
        dropdown.style.position = "absolute";
        dropdown.style.left = scrollX + rect.left + "px";
        dropdown.style.top = scrollY + rect.top + rect.height + "px";
        dropdown.style.zindex = 1000000;
        dropdown.onclick = () => dropdown.classList.add("isClicked");
  
        if (dropdown !== this.lastDropdown) {
          this.lastDropdown?.remove();
        }
        this.lastDropdown = dropdown;

        const eventCallback = () => {
          if (
            !dropdown.matches(":hover, :focus, :focus-within, .isClicked") &&
            !icon.matches(":hover, :focus, :focus-within")
          ) {
            setTimeout(() => this.checkGarbageDropdown(), 100);
            removeEventListener("scroll", eventCallback);
          }
        };
  
        dropdown.onmouseout = () => {
          setTimeout(() => this.checkGarbageDropdown(), 100);
        };
        dropdown.shadowRoot.addEventListener("close", () => dropdown.remove());
        icon.onblur = eventCallback;
        addEventListener("scroll", eventCallback);
        //dropdown.shadowRoot.querySelector(".closeButton").onclick = () => dropdown.remove();
      };
      icon.onclick = (e) => {
        dropdown.classList.add("isClicked");
        e.stopPropagation();
      };
      return { icon };
    };
}