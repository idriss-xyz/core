import {DefaultPageManager} from "./defaultPageManager";
import {StandalonePageManager} from "./standalonePageManager";
import {HuobiPageManager} from "./HuobiPageManager";
import {PoapPageManager} from "./PoapPageManager";
import {CoinbasePageManager} from "./CoinbasePageManager";
import {EtherscanPageManager} from "./etherscanPageManager";
import {ZKScanPageManager} from "./zkSyncScanPageManager";
import {LineaExplorerPageManager} from "./lineaExplorerPageManager";
import {BlockscoutPageManager} from "./blockscoutPageManager";
import {MantleExplorerPageManager} from "./mantleExplorerPageManager";

const specificDomainList = {
    "app.poap.xyz": PoapPageManager,
    // "huobi.com": HuobiPageManager,
    // "htx.com": HuobiPageManager,
    // "coinbase.com": CoinbasePageManager,
    "etherscan.io": EtherscanPageManager,
    "polygonscan.com": EtherscanPageManager,
    "bscscan.com": EtherscanPageManager,
    "ftmscan.com": EtherscanPageManager,
    "arbiscan.io": EtherscanPageManager,
    "snowtrace.io": EtherscanPageManager,
    "basescan.org": EtherscanPageManager,
    "scrollscan.org": EtherscanPageManager,
    "optimistic.etherscan.io": EtherscanPageManager,
    "moonriver.moonscan.io": EtherscanPageManager,
    "moonscan.io": EtherscanPageManager,
    "lineascan.build": EtherscanPageManager,
    "goerli.lineascan.build": EtherscanPageManager,
    "explorer.goerli.linea.build": LineaExplorerPageManager,
    "explorer.linea.build": BlockscoutPageManager,
    "explorer.zksync.io": ZKScanPageManager,
    "blockscout.com": BlockscoutPageManager,
    "explorer.mantle.xyz": BlockscoutPageManager,
    "blockscout.scroll.io": LineaExplorerPageManager,
    "evm-explorer.alephzero.org": BlockscoutPageManager
}
const defaultDomainList = [
    // "binance.com",
    // "kucoin.com",
    // "kraken.com",
    // "bitfinex.com",
    // "gate.io",
    // "binance.us",
    // "bithumb.com",
    // "bitstamp.net",
    // "bitflyer.com",
    // "gemini.com",
    // "bybit.com",
    // "bittrex.com",
    // "okx.com",
    // "coincheck.com",
    // "crypto.com",
    "poap.xyz",
    // "guarda.co"
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
