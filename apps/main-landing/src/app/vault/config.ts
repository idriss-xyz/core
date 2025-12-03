import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const wagmiconfig = getDefaultConfig({
  appName: 'IDRISS Login',
  projectId: 'c68a9fb876e8a1c0a99f89debcfeb2bf',
  chains: [base],
  ssr: true,
});
