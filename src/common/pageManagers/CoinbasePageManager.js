import {DefaultPageManager} from "./defaultPageManager";

export class CoinbasePageManager extends DefaultPageManager {
    allowedFiled(input) {
        return input.matches('textarea[name="recipient"]');
    }

    showPopup(input, key, elements) {
        this.lastPopup?.remove();
        let div = this.document.createElement('div');
        this.lastPopup = div;
        this.generatePopupContent(div, key, elements, (value) => {
            navigator.clipboard.writeText(value)
            input.value = '';
            input.focus();
            document.execCommand("insertText", false, value)

            let lastPopup = this.lastPopup;
            setTimeout(() => lastPopup?.remove(), 100);
        })
        let blurHandler = () => {
            setTimeout(() => div.remove(), 500);
            input.removeEventListener('blur', blurHandler)
        }
        input.addEventListener('blur', blurHandler)
        this.document.body.append(div);
        let rect = input.getBoundingClientRect()
        div.style.position = 'absolute';
        div.style.left = rect.left + 'px';
        div.style.top = rect.top + rect.height + 'px';
        div.style.width = rect.width + 'px';
        div.style.minWidth = '400px';
        div.style.zindex = 1000000;

    }
}