import { Router, Request, Response } from 'express';
import { AppDataSource } from '../db/database';
import { CreatorAddress } from '../db/entities';
import { Creator } from '../db/entities/creator.entity';
import { getAddress, Hex } from 'viem';

const router = Router();
const creatorAddressRepository = AppDataSource.getRepository(CreatorAddress);
const creatorRepository = AppDataSource.getRepository(Creator);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address, creatorId } = req.body;

    // Validate required fields
    if (!address || !creatorId) {
      res.status(400).json({
        error: 'Address and creatorId are required',
      });
      return;
    }

    // Validate address format (basic hex validation)
    if (!address.startsWith('0x')) {
      res.status(400).json({
        error: 'Invalid address format',
      });
      return;
    }

    const formattedAddress = getAddress(address) as Hex;

    // Check if creator exists
    const creator = await creatorRepository.findOne({
      where: { id: creatorId },
    });

    if (!creator) {
      res.status(404).json({
        error: 'Creator not found',
      });
      return;
    }

    // Check if address already exists for a creator
    const existingAddressInCreator = await creatorRepository.findOne({
      where: {
        address: formattedAddress,
      },
    });

    const existingAddressInCreatorAddress =
      await creatorAddressRepository.findOne({
        where: {
          address: formattedAddress,
          creator: { id: creatorId },
        },
      });

    if (existingAddressInCreatorAddress || existingAddressInCreator) {
      res.status(409).json({
        error: 'Address already exists for a creator',
      });
      return;
    }

    // Create new creator address
    const creatorAddress = creatorAddressRepository.create({
      address: formattedAddress,
      creator: creator,
    });

    const savedAddress = await creatorAddressRepository.save(creatorAddress);

    res.status(201).json({
      id: savedAddress.id,
      address: savedAddress.address,
      creatorId: creator.id,
    });
  } catch (error) {
    console.error('Error creating creator address:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;
