import template from "./tippingMain.mpts";
import eth_logo from "!!url-loader!../img/eth_logo.png"
import usdc_logo from "!!url-loader!../img/usdc_logo.png"
import arrow from "!!url-loader!../img/arrow.svg"
import pen from "!!url-loader!../img/pen.svg"
import close from "!!url-loader!../img/close.svg"
import maticTokenIcon from "!!url-loader!../img/matic-token-icon.webp"
import biannceCoinLogo from "!!url-loader!../img/binance-coin-logo.webp"
import {tokens} from "./tippingUtils";
import {create} from "fast-creator";

export class TippingMain {
    constructor(identifier) {
        const networks = [
            {name: 'BSC', img: biannceCoinLogo, chainId: 56, code: 'BSC'},
            {name: 'Ethereum', img: eth_logo, chainId: 1, code: 'ETH'},
            {name: 'Polygon ', img: maticTokenIcon, chainId: 137, code: 'Polygon'},
        ]
        this.html = create('div', {}, template({identifier, networks, tokens, eth_logo, usdc_logo, arrow, pen, close}));

        this.html.querySelectorAll('.select').forEach(select => {
            select.onclick = e => select.classList.toggle('isOpen')
            select.onblur = e => select.classList.remove('isOpen')
        })
        this.html.querySelectorAll('.select ul li').forEach(li => {
            li.onclick = e => {
                e.stopPropagation();
                const button = li.parentNode.parentNode.querySelector('button')
                button.querySelector('.name').textContent = li.querySelector('.name').textContent;
                button.querySelector('img').src = li.querySelector('img').src;
                Object.assign(button.parentNode.dataset, li.dataset);
                li.parentNode.parentNode.classList.remove('isOpen')
                this.refreshVisibleCoins()
            }
        })
        this.html.querySelector('.send')?.addEventListener('click', (e) => {
            let network = this.html.querySelector('.networkSelect').dataset.network;
            let token = this.html.querySelector('.tokenSelect').dataset.symbol;
            let amount = this.html.querySelector('.valueSelection .isSelected input')?.value || this.html.querySelector('.valueSelection .isSelected').dataset.value;
            this.html.dispatchEvent(Object.assign(new Event('sendMoney', {bubbles: true}), {
                identifier,
                network,
                amount,
                token
            }))
        });
        this.html.querySelectorAll('.valueSelection > *').forEach(b => {
            b.onclick = e => {
                this.html.querySelectorAll('.valueSelection  > *').forEach(x => x.classList.remove('isSelected'))
                b.classList.add('isSelected')
                b.querySelector('input')?.focus();
            }
        })
        this.refreshVisibleCoins();
    }

    refreshVisibleCoins() {
        let network = this.html.querySelector('.networkSelect').dataset.network;
        let tokens = this.html.querySelectorAll('.tokenSelect li')
        for (let token of tokens) {
            token.style.display = token.dataset.network == network ? '' : 'none';
        }
        if (this.html.querySelector('.tokenSelect').dataset.network != network) {
            this.html.querySelector(`.tokenSelect li[data-network="${network}"]`).click();
        }
    }
}