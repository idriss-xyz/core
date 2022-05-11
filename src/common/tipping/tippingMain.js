import template from "./tippingMain.mpts";
import eth_logo from "../img/eth_logo.png";
import usdc_logo from "../img/usdc_logo.png";
import arrow from "../img/arrow.svg";
import pen from "../img/pen.svg";
import close from "../img/close.svg";
import biannceCoinLogo from "../img/binance-coin-logo.webp";
import maticTokenIcon from "../img/matic-token-icon.webp";
import {tokens} from "./tippingUtils";

export class TippingMain {
    constructor(identifier) {
        const networks = [
            {name: 'BSC', img: biannceCoinLogo, chainId: 56},
            {name: 'Ethereum', img: eth_logo, chainId: 1},
            {name: 'Polygon ', img: maticTokenIcon, chainId: 137},
        ]
        this.html = template({identifier, networks, tokens, eth_logo, usdc_logo, arrow, pen, close});


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
        this.refreshVisibleCoins();
    }

    refreshVisibleCoins() {
        let chainId = this.html.querySelector('.networkSelect').dataset.chainId;
        let tokens = this.html.querySelectorAll('.tokenSelect li')
        for (let token of tokens) {
            token.style.display = token.dataset.chainId == chainId ? '' : 'none';
        }
        if (this.html.querySelector('.tokenSelect').dataset.chainId != chainId) {
            this.html.querySelector(`.tokenSelect li[data-chain-id="${chainId}"]`).click();
        }
    }
}