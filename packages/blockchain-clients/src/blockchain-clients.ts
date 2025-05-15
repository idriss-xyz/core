import { createPublicClient, http } from 'viem';
import { CHAIN } from '@idriss-xyz/constants';

export const clientBase = createPublicClient({
  chain: CHAIN.BASE,
  transport: http('https://base-rpc.publicnode.com'),
});

export const clientEthereum = createPublicClient({
  chain: CHAIN.ETHEREUM,
  transport: http('https://eth.llamarpc.com'),
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
];
