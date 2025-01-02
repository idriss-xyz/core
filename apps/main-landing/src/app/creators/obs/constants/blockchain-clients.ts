import { createPublicClient, http } from 'viem';

import { CHAIN } from '../../donate/constants';

const clientBase = createPublicClient({
  chain: CHAIN.BASE,
  transport: http(),
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

const clientMantle = createPublicClient({
  chain: CHAIN.MANTLE,
  transport: http(),
});

const clientOptimism = createPublicClient({
  chain: CHAIN.OPTIMISM,
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
    chain: CHAIN.MANTLE.id,
    client: clientMantle,
    name: CHAIN.MANTLE.name.toLowerCase(),
  },
];
