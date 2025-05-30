import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, mantle, base, ronin } from 'wagmi/chains';
import { defineChain, createPublicClient, http } from 'viem';
import { ABSTRACT_LOGO, ALEPH_LOGO } from '@idriss-xyz/constants';

const alephzero = defineChain({
  id: 41_455,
  name: 'Aleph Zero EVM',
  logo: ALEPH_LOGO,
  nativeCurrency: {
    name: 'AZERO',
    symbol: 'AZERO',
    decimals: 18,
  },
  rpcUrls: { default: { http: ['https://rpc.alephzero.raas.gelato.cloud'] } },
  blockExplorers: {
    default: {
      name: 'Evm Explorer',
      url: 'https://evm-explorer.alephzero.org',
    },
  },
});

const abstract = defineChain({
  id: 2741,
  name: 'Abstract',
  logo: ABSTRACT_LOGO,
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: { default: { http: ['https://api.mainnet.abs.xyz'] } },
  blockExplorers: {
    default: {
      name: 'Evm Explorer',
      url: 'https://abscan.org',
    },
  },
});

export const wagmiconfig = getDefaultConfig({
  appName: 'IDRISS Creators Login',
  projectId: 'c68a9fb876e8a1c0a99f89debcfeb2bf',
  chains: [
    mainnet,
    polygon,
    optimism,
    mantle,
    base,
    alephzero,
    abstract,
    ronin,
  ],
  ssr: true,
});

export const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http('https://1rpc.io/eth'),
});
