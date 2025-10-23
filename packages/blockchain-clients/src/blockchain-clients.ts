import { createPublicClient, http } from 'viem';
import { CREATOR_CHAIN } from '@idriss-xyz/constants';
import { base, mainnet, abstract, ronin, avalanche } from 'viem/chains';

export const clientBase = createPublicClient({
  chain: base,
  transport: http('https://base-rpc.publicnode.com'),
});

export const clientEthereum = createPublicClient({
  chain: mainnet,
  transport: http('https://ethereum-rpc.publicnode.com'),
});

const clientAbstract = createPublicClient({
  chain: abstract,
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

export const clients = [
  {
    chain: CREATOR_CHAIN.BASE.id,
    client: clientBase,
    name: CREATOR_CHAIN.BASE.name.toLowerCase(),
  },
  {
    chain: CREATOR_CHAIN.ETHEREUM.id,
    client: clientEthereum,
    name: CREATOR_CHAIN.ETHEREUM.name.toLowerCase(),
  },
  {
    chain: CREATOR_CHAIN.RONIN.id,
    client: clientRonin,
    name: CREATOR_CHAIN.RONIN.shortName.toLowerCase(),
  },
  {
    chain: CREATOR_CHAIN.AVALANCHE.id,
    client: clientAvalanche,
    name: CREATOR_CHAIN.AVALANCHE.shortName.toLowerCase(),
  },
  {
    chain: CREATOR_CHAIN.ABSTRACT.id,
    client: clientAbstract,
    name: CREATOR_CHAIN.ABSTRACT.shortName.toLowerCase(),
  },
];
