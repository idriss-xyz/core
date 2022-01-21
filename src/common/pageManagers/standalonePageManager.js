import {AbstractPageManager} from "./abstractPageManager";

export class StandalonePageManager extends AbstractPageManager {
    init() {
        this.document.addEventListener('input', async e => {
            this.lastEvent = {event: e, date: new Date(), input: e.target, value: e.target.value}
            setTimeout(() => this.checkInputChanged(), 500)
        })
    }

    async checkInputChanged() {
        if (new Date() - this.lastEvent?.date >= 500 && this.lastEvent?.input.value == this.lastEvent?.value && this.lastEvent?.value.length >= 3) {
            let event = this.lastEvent;
            const results = this.document.createElement('div')
            results.className = 'results';
            this.document.querySelector('.results').replaceWith(results)
            let data = await this.apiCall(event.value);
            if (data?.result && Object.values(data.result).length > 0 && event == this.lastEvent) {
                this.generatePopupContent(results, data.input, data.result, value => {
                    navigator.clipboard.writeText(value)
                })
            }
        }
    }
}