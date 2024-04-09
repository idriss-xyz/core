import { useQuery } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';

import { CHAIN, Hex, createEthersProvider, useWallet } from 'shared/web3';

import { GetFunderAddresCommand } from '../../commands';
import { AccountNotFoundError } from '../../errors';
import { ERC_20_ABI, SAFE_USDC_ADDRES } from '../../polymarket.constants';

import { getSafeWalletQueryKey } from './use-safe-wallet';

const getFunderAddress = async (address: string) => {
  const command = new GetFunderAddresCommand({ address });
  return command.send<string | undefined>();
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
        throw new AccountNotFoundError();
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