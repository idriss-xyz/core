import { createPublicClient, webSocket } from 'viem';

import { CHAIN } from '../../donate/constants';

const WEBSOCKET_OPTIONS = {
  timeout: 5000,
};

const clientBase = createPublicClient({
  chain: CHAIN.BASE,
  transport: webSocket('', WEBSOCKET_OPTIONS),
});

export const clientEthereum = createPublicClient({
  chain: CHAIN.ETHEREUM,
  transport: webSocket('', WEBSOCKET_OPTIONS),
});

const clientPolygon = createPublicClient({
  chain: CHAIN.POLYGON,
  transport: webSocket('', WEBSOCKET_OPTIONS),
});

const clientAleph = createPublicClient({
  chain: CHAIN.ALEPH,
  transport: webSocket('', WEBSOCKET_OPTIONS),
});

const clientAbstract = createPublicClient({
  chain: CHAIN.ABSTRACT,
  transport: webSocket('', WEBSOCKET_OPTIONS),
});

const clientMantle = createPublicClient({
  chain: CHAIN.MANTLE,
  transport: webSocket('', WEBSOCKET_OPTIONS),
});

const clientOptimism = createPublicClient({
  chain: CHAIN.OPTIMISM,
  transport: webSocket('', WEBSOCKET_OPTIONS),
});

const clientRonin = createPublicClient({
  chain: CHAIN.RONIN,
  transport: webSocket('', WEBSOCKET_OPTIONS),
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
