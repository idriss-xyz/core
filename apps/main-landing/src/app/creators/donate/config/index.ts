import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, base, ronin } from 'wagmi/chains';
import { defineChain, createPublicClient, http } from 'viem';
import { ABSTRACT_LOGO } from '@idriss-xyz/constants';

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
  chains: [mainnet, base, abstract, ronin],
  ssr: true,
});

export const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http('https://1rpc.io/eth'),
});
