import { createPublicClient, http } from 'viem';
import { CHAIN } from '@idriss-xyz/constants';
import {
  base,
  mainnet,
  polygon,
  abstract,
  celo,
  linea,
  optimism,
  ronin,
  avalanche,
  arbitrum,
  scroll,
  zksync,
} from 'viem/chains';

export const clientBase = createPublicClient({
  chain: base,
  transport: http('https://base-rpc.publicnode.com'),
});

export const clientEthereum = createPublicClient({
  chain: mainnet,
  transport: http('https://ethereum-rpc.publicnode.com'),
});

const clientPolygon = createPublicClient({
  chain: polygon,
  transport: http('https://polygon-rpc.com/'),
});

const clientAbstract = createPublicClient({
  chain: abstract,
  transport: http(),
});

const clientOptimism = createPublicClient({
  chain: optimism,
  transport: http(),
});

const clientRonin = createPublicClient({
  chain: ronin,
  transport: http(),
});

const clientAvalanche = createPublicClient({
  chain: avalanche,
  transport: http(),
});

const clientCelo = createPublicClient({
  chain: celo,
  transport: http(),
});

const clientArbitrum = createPublicClient({
  chain: arbitrum,
  transport: http(),
});

const clientLinea = createPublicClient({
  chain: linea,
  transport: http(),
});

const clientZKSync = createPublicClient({
  chain: zksync,
  transport: http(),
});

const clientScroll = createPublicClient({
  chain: scroll,
  transport: http(),
});

const clientBNB = createPublicClient({
  chain: CHAIN.BNB_CHAIN,
  transport: http(),
});

export const clients = [
  {
    chain: CHAIN.BASE.id,
    client: clientBase,
    name: CHAIN.BASE.name.toLowerCase(),
  },
  {
    chain: CHAIN.ETHEREUM.id,
    client: clientEthereum,
    name: CHAIN.ETHEREUM.name.toLowerCase(),
  },
  {
    chain: CHAIN.AVALANCHE.id,
    client: clientAvalanche,
    name: CHAIN.AVALANCHE.name.toLowerCase(),
  },
  {
    chain: CHAIN.POLYGON.id,
    client: clientPolygon,
    name: CHAIN.POLYGON.name.toLowerCase(),
  },
  {
    chain: CHAIN.OPTIMISM.id,
    client: clientOptimism,
    name: CHAIN.OPTIMISM.shortName.toLowerCase(),
  },
  {
    chain: CHAIN.RONIN.id,
    client: clientRonin,
    name: CHAIN.RONIN.shortName.toLowerCase(),
  },
  {
    chain: CHAIN.AVALANCHE.id,
    client: clientAvalanche,
    name: CHAIN.AVALANCHE.shortName.toLowerCase(),
  },
  {
    chain: CHAIN.ABSTRACT.id,
    client: clientAbstract,
    name: CHAIN.ABSTRACT.shortName.toLowerCase(),
  },
  {
    chain: CHAIN.LINEA.id,
    client: clientLinea,
    name: CHAIN.LINEA.name.toLowerCase(),
  },
  {
    chain: CHAIN.ARBITRUM_ONE.id,
    client: clientArbitrum,
    name: CHAIN.ARBITRUM_ONE.name.toLowerCase(),
  },
  {
    chain: CHAIN.ZK_SYNC_ERA.id,
    client: clientZKSync,
    name: CHAIN.ZK_SYNC_ERA.name.toLowerCase(),
  },
  {
    chain: CHAIN.SCROLL.id,
    client: clientScroll,
    name: CHAIN.SCROLL.name.toLowerCase(),
  },
  {
    chain: CHAIN.CELO.id,
    client: clientCelo,
    name: CHAIN.CELO.name.toLowerCase(),
  },
  {
    chain: CHAIN.BNB_CHAIN.id,
    client: clientBNB,
    name: CHAIN.BNB_CHAIN.name.toLowerCase(),
  },
];
