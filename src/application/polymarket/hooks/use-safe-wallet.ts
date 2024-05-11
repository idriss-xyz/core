import { useQuery } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';

import {
  CHAIN,
  Hex,
  Wallet,
  createEthersProvider,
  useWallet,
} from 'shared/web3';

import { GetFunderAddresCommand } from '../commands';
import { ERC_20_ABI, SAFE_USDC_ADDRES } from '../constants';

export const getSafeWalletQueryKey = (wallet?: Wallet) => {
  return ['getSafeWallet', wallet?.account, wallet?.chainId];
};

// TODO: useCommandQuery
const getFunderAddress = async (address: string) => {
  const command = new GetFunderAddresCommand({ address });
  return command.send();
};

export const useSafeWallet = () => {
  const { wallet } = useWallet();

  return useQuery({
    queryKey: getSafeWalletQueryKey(wallet),
    enabled: !!wallet && wallet.chainId === CHAIN.POLYGON.id,
    queryFn: async () => {
      if (!wallet || wallet.chainId !== CHAIN.POLYGON.id) {
        return;
      }

      const address = await getFunderAddress(wallet.account);
      if (!address) {
        throw new Error('Account not found');
      }

      const ethersProvider = createEthersProvider(wallet.provider);

      const usdcContract = new ethers.Contract(
        SAFE_USDC_ADDRES,
        ERC_20_ABI,
        ethersProvider,
      );

      const funderBalance: BigNumber =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await usdcContract.balanceOf(address);

      const balance = funderBalance.toNumber() / 1_000_000;

      return { address: address as Hex, balance };
    },
  });
};
