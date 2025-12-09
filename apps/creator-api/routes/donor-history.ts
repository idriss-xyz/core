import { Router, Request, Response } from 'express';

import {
  calculateGlobalDonorLeaderboard,
  calculateStatsForDonor,
  resolveCreatorAndAddresses,
} from '../utils/calculate-stats';
import {
  AppDataSource,
  Creator,
  fetchDonationsByFromAddress,
  fetchDonations,
} from '@idriss-xyz/db';
import { enrichDonationsWithCreatorInfo } from '../utils/calculate-stats';
import { createAddressToCreatorMap } from '@idriss-xyz/utils';
import { formatUnits } from 'viem';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'Invalid or missing name parameter' });
      return;
    }

    const { addresses: allAddresses } = await resolveCreatorAndAddresses(name);

    if (allAddresses.length === 0) {
      res.status(404).json({ error: 'Creator not found' });
      return;
    }

    const donations = (
      await Promise.all(
        allAddresses.map((addr) => fetchDonationsByFromAddress(addr)),
      )
    ).flat();

    const creators = await AppDataSource.getRepository(Creator).find({
      relations: ['associatedAddresses'],
    });
    const addressToCreatorMap = createAddressToCreatorMap(creators);
    enrichDonationsWithCreatorInfo(donations, addressToCreatorMap);

    const stats = await calculateStatsForDonor(donations, name);

    // ── inject fresh avatar from Creator table
    const donorCreator = allAddresses
      .map((addr) => addressToCreatorMap.get(addr.toLowerCase()))
      .find(Boolean);
    if (donorCreator?.profilePictureUrl)
      stats.donorAvatarUrl = donorCreator.profilePictureUrl;

    const leaderboard = await calculateGlobalDonorLeaderboard();
    const donorPosition = leaderboard.findIndex((entry) =>
      allAddresses.some((a) => a.toLowerCase() === entry.address.toLowerCase()),
    );
    stats.positionInLeaderboard =
      donorPosition !== -1 ? donorPosition + 1 : null;

    res.json({
      stats,
      donations,
    });
  } catch (error) {
    console.error('Donor history error:', error);
    res.status(500).json({ error: 'Failed to fetch donor history' });
  }
});

router.get('/csv', async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'Invalid or missing name parameter' });
      return;
    }

    const { addresses: allAddresses } = await resolveCreatorAndAddresses(name);
    if (allAddresses.length === 0) {
      res.status(404).json({ error: 'Creator not found' });
      return;
    }

    const donations = (
      await Promise.all(
        allAddresses.map((addr) => fetchDonationsByFromAddress(addr)),
      )
    ).flat();

    if (donations.length === 0) {
      res.status(200).send('No donations for this user');
      return;
    }

    const creators = await AppDataSource.getRepository(Creator).find({
      relations: ['associatedAddresses'],
    });
    const addressToCreatorMap = createAddressToCreatorMap(creators);
    enrichDonationsWithCreatorInfo(donations, addressToCreatorMap);

    const rows = donations.map((d) => {
      const isToken = d.kind === 'token';
      let amountFormatted = '';

      if (isToken) {
        if (d.amountRaw && d.token?.decimals !== undefined) {
          try {
            amountFormatted = formatUnits(
              BigInt(d.amountRaw),
              d.token.decimals,
            );
          } catch {
            amountFormatted = '';
          }
        }
      } else {
        amountFormatted = d.quantity !== undefined ? String(d.quantity) : '';
      }

      const timestampUTC = d.timestamp
        ? new Date(d.timestamp).toISOString()
        : '';

      return {
        transactionHash: d.transactionHash,
        network: d.network ?? '',
        timestamp: d.timestamp,
        timestampUTC,
        assetType: d.kind ?? '',
        assetSymbolOrName: isToken ? (d.token?.symbol ?? '') : (d.name ?? ''),
        rawAmount: isToken ? (d.amountRaw ?? '') : (d.quantity ?? ''),
        amountFormatted,
        tradeValueUSD: d.tradeValue ?? '',
        fromAddress: d.fromAddress ?? '',
        toAddress: d.toAddress ?? '',
        toUserName: d.toUser?.displayName ?? '',
      };
    });

    const header = Object.keys(rows[0]).join(',');
    const csvLines = rows.map((r) =>
      Object.values(r)
        .map((v) =>
          v === null || v === undefined
            ? ''
            : `"${String(v).replace(/"/g, '""')}"`,
        )
        .join(','),
    );

    const csvContent = [header, ...csvLines].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${name}-donations.csv`,
    );
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
});

router.get('/csv/all', async (req: Request, res: Response) => {
  const { secret } = req.query;
  if (secret !== process.env.SECRET_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const grouped = await fetchDonations();
    const donations = Object.values(grouped).flat();

    if (donations.length === 0) {
      res.status(200).send('No donations');
      return;
    }

    // ── add creator meta data (same helpers already used above) ─────
    const creators = await AppDataSource.getRepository(Creator).find({
      relations: ['associatedAddresses'],
    });
    const addressToCreatorMap = createAddressToCreatorMap(creators);
    enrichDonationsWithCreatorInfo(donations, addressToCreatorMap);

    // ── build CSV rows (logic identical to /csv route) ──────────────
    const rows = donations.map((d) => {
      const isToken = d.kind === 'token';
      let amountFormatted = '';

      if (isToken) {
        if (d.amountRaw && d.token?.decimals !== undefined) {
          try {
            amountFormatted = formatUnits(
              BigInt(d.amountRaw),
              d.token.decimals,
            );
          } catch {
            amountFormatted = '';
          }
        }
      } else {
        amountFormatted = d.quantity !== undefined ? String(d.quantity) : '';
      }

      const timestampUTC = d.timestamp
        ? new Date(d.timestamp).toISOString()
        : '';

      return {
        transactionHash: d.transactionHash,
        network: d.network ?? '',
        timestamp: d.timestamp,
        timestampUTC,
        assetType: d.kind ?? '',
        assetSymbolOrName: isToken ? (d.token?.symbol ?? '') : (d.name ?? ''),
        rawAmount: isToken ? (d.amountRaw ?? '') : (d.quantity ?? ''),
        amountFormatted,
        tradeValueUSD: d.tradeValue ?? '',
        fromAddress: d.fromAddress ?? '',
        toAddress: d.toAddress ?? '',
        toUserName: d.toUser?.displayName ?? '',
        comment: d.comment,
      };
    });

    const header = Object.keys(rows[0]).join(',');
    const csvLines = rows.map((r) =>
      Object.values(r)
        .map((v) =>
          v === null || v === undefined
            ? ''
            : `"${String(v).replace(/"/g, '""')}"`,
        )
        .join(','),
    );
    const csvContent = [header, ...csvLines].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=all-donations.csv',
    );
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
});

export default router;
