import {DefaultPageManager} from "./defaultPageManager";
import {StandalonePageManager} from "./standalonePageManager";
import {FtxPageManager} from "./FtxPageManager";
import {HuobiPageManager} from "./HuobiPageManager";
import {PoapPageManager} from "./PoapPageManager";
import {TwitterPageManager} from "./twitterPageManager";
import {CoinbasePageManager} from "./CoinbasePageManager";
import {EtherscanPageManager} from "./etherscanPageManager";
import {ZKScanPageManager} from "./zkSyncScanPageManager";
import {LineaExplorerPageManager} from "./lineaExplorerPageManager";

const specificDomainList = {
    "app.poap.xyz": PoapPageManager,
    "ftx.com": FtxPageManager,
    "huobi.com": HuobiPageManager,
    "twitter.com": TwitterPageManager,
    "coinbase.com": CoinbasePageManager,
    "etherscan.io": EtherscanPageManager,
    "polygonscan.com": EtherscanPageManager,
    "bscscan.com": EtherscanPageManager,
    "ftmscan.com": EtherscanPageManager,
    "arbiscan.io": EtherscanPageManager,
    "snowtrace.io": EtherscanPageManager,
    "optimistic.etherscan.io": EtherscanPageManager,
    "moonriver.moonscan.io": EtherscanPageManager,
    "moonscan.io": EtherscanPageManager,
    "goerli.lineascan.build": EtherscanPageManager,
    "explorer.goerli.linea.build": LineaExplorerPageManager,
    "explorer.zksync.io": ZKScanPageManager
}
const defaultDomainList = [
    "binance.com",
    "kucoin.com",
    "kraken.com",
    "bitfinex.com",
    "gate.io",
    "binance.us",
    "bithumb.com",
    "bitstamp.net",
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
    "guarda.co",
    "app.wirexapp.com"
];

export async function pageManagerFactory(document, url) {
    console.log('pageManagerFactory')
    let specific = Object.entries(specificDomainList).find(([domain, constructor]) => url.hostname === domain || url.hostname.endsWith('.' + domain))
    if (specific) {
        return new specific[1](document)
    } else if (defaultDomainList.some(x => url.hostname === x || url.hostname.endsWith('.' + x))) {
        return new DefaultPageManager(document)
    }
}