import { Router, Request, Response } from 'express';
import { AppDataSource } from '../db/database';
import { CreatorAddress } from '../db/entities';
import { Creator } from '../db/entities/creator.entity';
import { getAddress, Hex, isAddress } from 'viem';
import { verifyToken } from '../db/middleware/auth.middleware';

const router = Router();
const creatorAddressRepository = AppDataSource.getRepository(CreatorAddress);
const creatorRepository = AppDataSource.getRepository(Creator);

router.post('/', verifyToken(), async (req: Request, res: Response) => {
  try {
    const { address } = req.body;

    // Validate user id
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate required field
    if (!address || !isAddress(address)) {
      res.status(400).json({
        error: 'Invalid address',
      });
      return;
    }

    const formattedAddress = getAddress(address) as Hex;

    // Check if creator exists
    const creator = await creatorRepository.findOne({
      where: { privyId: req.user.id },
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
          creator: { privyId: req.user.id },
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
