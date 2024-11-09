import { DefaultPageManager } from "./defaultPageManager";
import { HuobiPageManager } from "./HuobiPageManager";
import { PoapPageManager } from "./PoapPageManager";
import { CoinbasePageManager } from "./CoinbasePageManager";
import { EtherscanPageManager } from "./etherscanPageManager";
import { ZKScanPageManager } from "./zkSyncScanPageManager";
import { LineaExplorerPageManager } from "./lineaExplorerPageManager";
import { BlockscoutPageManager } from "./blockscoutPageManager";
import { MantleExplorerPageManager } from "./mantleExplorerPageManager";

const specificDomainList = {
  "app.poap.xyz": PoapPageManager,
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
  "poap.xyz"
];

export function pageManagerFactory(document, url) {
  let specific = Object.entries(specificDomainList).find(([domain, constructor]) => url.hostname === domain || url.hostname.endsWith('.' + domain))
  if (specific) {
    return new specific[1](document)
  } else if (defaultDomainList.some(x => url.hostname === x || url.hostname.endsWith('.' + x))) {
    return new DefaultPageManager(document)
  }
}
