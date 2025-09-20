import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, base, ronin, abstract } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';

export const wagmiconfig = getDefaultConfig({
  appName: 'IDRISS Creators Login',
  projectId: 'c68a9fb876e8a1c0a99f89debcfeb2bf',
  // chains: [mainnet, base, abstract, ronin, avalanche],
  chains: [mainnet, base, abstract, ronin],
  ssr: true,
});

export const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http('https://1rpc.io/eth'),
});
