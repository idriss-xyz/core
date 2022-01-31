import {DefaultPageManager} from "./defaultPageManager";
import {StandalonePageManager} from "./standalonePageManager";
import {FtxPageManager} from "./FtxPageManager";
import {HuobiPageManager} from "./HuobiPageManager";
import {PoapPageManager} from "./PoapPageManager";

const specificDomainList = {
    "app.poap.xyz": PoapPageManager,
    "ftx.com": FtxPageManager,
    "huobi.com": HuobiPageManager
}
const defaultDomainList = [
    "binance.com",
    "coinbase.com",
    "kucoin.com",
    "kraken.com",
    "bitfinex.com",
    "gate.io",
    "binance.us",
    "bithumb.com",
    "bitstamp.net",
    "ftx.us",
    "bitflyer.com",
    "poloniex.com",
    "gemini.com",
    "coinone.co.kr",
    "bybit.com",
    "bittrex.com",
    "okex.com",
    "liquid.com",
    "coincheck.com",
    "crypto.com",
    "zaif.jp",
    "ascendex.com",
    "tokocrypto.com",
    "poap.xyz",
    "etherscan.io",
    "guarda.co"
];

export async function pageManagerFactory(document, url) {
    let specific = Object.entries(specificDomainList).find(([domain, constructor]) => url.hostname === domain || url.hostname.endsWith('.' + domain))
    if (specific) {
        return new specific[1](document)
    } else if (defaultDomainList.some(x => url.hostname === x || url.hostname.endsWith('.' + x))) {
        return new DefaultPageManager(document)
    }
}