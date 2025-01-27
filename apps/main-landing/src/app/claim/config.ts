import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

// TODO: Remove baseSepolia on production
export const wagmiconfig = getDefaultConfig({
  appName: 'IDRISS Creators Login',
  projectId: 'c68a9fb876e8a1c0a99f89debcfeb2bf',
  chains: [base, baseSepolia],
  ssr: true,
});
