import { getAddress, Hex } from 'viem';

import { AppDataSource } from './database';
import { Creator } from './entities';

export async function getCreatorNameOrAnon(address: string): Promise<string> {
  address = getAddress(address);
  const creatorRepository = AppDataSource.getRepository(Creator);

  // First, try to find creator by primary address
  const creatorByPrimaryAddress = await creatorRepository.findOne({
    where: { primaryAddress: address as Hex },
  });

  if (creatorByPrimaryAddress) {
    return creatorByPrimaryAddress.name;
  }

  // If not found, search in associated addresses
  const creatorByAssociatedAddress = await creatorRepository.findOne({
    where: {
      associatedAddresses: {
        address: address as Hex,
      },
    },
    relations: ['associatedAddresses'],
  });

  if (creatorByAssociatedAddress) {
    return creatorByAssociatedAddress.name;
  }

  return 'anon';
}
