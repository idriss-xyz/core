import { Chain, CREATOR_CHAIN } from '@idriss-xyz/constants';

const dbNameToChainMap = new Map<string, Chain>();
Object.values(CREATOR_CHAIN).forEach((chain) => {
  dbNameToChainMap.set(chain.dbName, chain);
});

export function getChainByNetworkName(networkName: string): Chain | undefined {
  return dbNameToChainMap.get(networkName);
}
