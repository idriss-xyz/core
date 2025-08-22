import { AppDataSource } from '../db/database';
import { DripDailyClaim } from './entities';

const todayUTC = () => {
  const n = new Date();
  const y = n.getUTCFullYear();
  const m = String(n.getUTCMonth() + 1).padStart(2, '0');
  const d = String(n.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export async function hasClaimedToday(creatorId: number, chainId: number) {
  const repo = AppDataSource.getRepository(DripDailyClaim);
  return !!(await repo.findOne({
    where: { creatorId, chainId, day: todayUTC() },
  }));
}

export async function recordClaim(creatorId: number, chainId: number) {
  const repo = AppDataSource.getRepository(DripDailyClaim);
  await repo.save(repo.create({ creatorId, chainId, day: todayUTC() }));
}
