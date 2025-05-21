import { createPublicClient, http } from 'viem';
import { CHAIN } from '@idriss-xyz/constants';

export const clientBase = createPublicClient({
  chain: CHAIN.BASE,
  transport: http('https://base-rpc.publicnode.com'),
});

export const clientEthereum = createPublicClient({
  chain: CHAIN.ETHEREUM,
  transport: http('https://ethereum-rpc.publicnode.com'),
});

const clientPolygon = createPublicClient({
  chain: CHAIN.POLYGON,
  transport: http('https://polygon-rpc.com/'),
});

const clientAleph = createPublicClient({
  chain: CHAIN.ALEPH,
  transport: http(),
});

const clientAbstract = createPublicClient({
  chain: CHAIN.ABSTRACT,
  transport: http(),
});

const clientMantle = createPublicClient({
  chain: CHAIN.MANTLE,
  transport: http(),
});

const clientOptimism = createPublicClient({
  chain: CHAIN.OPTIMISM,
  transport: http(),
});

const clientRonin = createPublicClient({
  chain: CHAIN.RONIN,
  transport: http(),
});

const clientCelo = createPublicClient({
  chain: CHAIN.CELO,
  transport: http(),
});

const clientArbitrum = createPublicClient({
  chain: CHAIN.ARBITRUM_ONE,
  transport: http(),
});

const clientLinea = createPublicClient({
  chain: CHAIN.LINEA,
  transport: http(),
});

const clientZKSync = createPublicClient({
  chain: CHAIN.ZK_SYNC_ERA,
  transport: http(),
});

const clientScroll = createPublicClient({
  chain: CHAIN.SCROLL,
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
    chain: CHAIN.ALEPH.id,
    client: clientAleph,
    name: CHAIN.ALEPH.shortName.toLowerCase(),
  },
  {
    chain: CHAIN.RONIN.id,
    client: clientRonin,
    name: CHAIN.RONIN.shortName.toLowerCase(),
  },
  {
    chain: CHAIN.ABSTRACT.id,
    client: clientAbstract,
    name: CHAIN.ABSTRACT.shortName.toLowerCase(),
  },
  {
    chain: CHAIN.MANTLE.id,
    client: clientMantle,
    name: CHAIN.MANTLE.name.toLowerCase(),
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
