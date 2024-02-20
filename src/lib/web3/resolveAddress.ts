import { ethers } from 'ethers';
import { IdrissCrypto } from 'idriss-crypto/lib/browser';

export const resolveAddress = async (address: string) => {
  const idriss = new IdrissCrypto();
  const idrissResolved: string = await idriss.reverseResolve(address);
  if (idrissResolved.length > 0) {
    return idrissResolved;
  }

  const ethersProvider = new ethers.providers.JsonRpcProvider(
    'https://eth.llamarpc.com/',
  );
  const ensResolved = await ethersProvider.lookupAddress(address);
  if (ensResolved && ensResolved.length > 0) {
    return ensResolved;
  }

  return undefined;
};
