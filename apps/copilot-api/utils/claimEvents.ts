import { createPublicClient, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';
import fs from 'fs';

const CLAIMED_EVENT = 'event Claimed(address by, address token, address to, uint256 total, uint256[] claimIndices, bytes memo, bool bonus)';
const CLAIM_CONTRACT_ADDRESS = '0xfD76c3a2A4534D815c9C5127119e6ea738A28837';

let latestBlockRead = BigInt(25614734);

export async function fetchAndWriteClaimEvents() {
  try {

    const client = createPublicClient({
      chain: base,
      transport: http('https://base-rpc.publicnode.com'),
    });

    const parsedEvent = parseAbiItem(CLAIMED_EVENT);

    const claimLogs = await client.getLogs({
      address: CLAIM_CONTRACT_ADDRESS,
      event: parsedEvent,
      fromBlock: latestBlockRead,
      toBlock: 'latest'
    });

    const claimedEvents: Record<string, { bonus: boolean; total: string }> = {};

    for (const log of claimLogs) {
      const { args } = log;
      if (!args) continue;

      const { to, total, bonus } = args;

      if (!to || !total || !bonus) continue;

      claimedEvents[to] = {
        bonus,
        total: total.toString()
      };
    }

    const existingEvents = fs.existsSync('claimedEvents.json')
      ? JSON.parse(fs.readFileSync('claimedEvents.json', 'utf-8'))
      : {};
    const mergedEvents = { ...existingEvents, ...claimedEvents };
    fs.writeFileSync('claimedEvents.json', JSON.stringify(mergedEvents, null, 2));
    latestBlockRead = claimLogs[claimLogs.length - 1].blockNumber;
  }
  catch (error) {
    console.error("Failed fetching claim events. ", error);
  }
}

export function startFetchingClaimEvents() {
  setInterval(fetchAndWriteClaimEvents, 5000);
}
