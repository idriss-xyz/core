import css from "./popup.scss";

export class AbstractPageManager {

    constructor(document) {
        this.document = document;
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
            if (key.startsWith("@")){
                keyElement.style.color="#1DA1F2";
                let imgElement = document.createElement('img')
                imgElement.src = "https://www.idriss.xyz/static/images/twitter.png"
                imgElement.alt = "Twitter"
                imgElement.className = 'img'
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
}