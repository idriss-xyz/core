import fs from 'fs';
import { createPublicClient, formatEther, Hex, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';
import { NextResponse } from 'next/server';
import { CLAIM_CONTRACT_ADDRESS, CLAIMED_EVENT } from '@/app/vault/constants';

interface ClaimEvent {
   to: Hex | undefined;
   total: string | undefined;
   bonus: boolean | undefined;
}

interface ApiResponse {
   error?: string;
   events?: ClaimEvent[];
}

const publicClient = createPublicClient({
   chain: base,
   transport: http('https://base-rpc.publicnode.com'),
});

const BLOCK_RANGE = 5000n; // Range for fetching blocks in chunks

const fetchClaimedEvents = async (): Promise<ClaimEvent[]> => {
   let currentBlock = BigInt(25614734); // Start from the airdrop block
   const latestBlock = await publicClient.getBlockNumber();
   console.log('Latest block:', latestBlock);
   let events: ClaimEvent[] = [];

   while (currentBlock < latestBlock) {
      const toBlock = currentBlock + BLOCK_RANGE > latestBlock ? latestBlock : currentBlock + BLOCK_RANGE;

      const claimLogs = await publicClient.getLogs({
         address: CLAIM_CONTRACT_ADDRESS,
         event: parseAbiItem(CLAIMED_EVENT),
         fromBlock: currentBlock,
         toBlock: toBlock,
      });

      claimLogs.forEach((log) => {
         const { args } = log;
         if (args) {
            const { to, total, bonus } = args;
            events.push({ to, total: formatEther(total!), bonus });
         }
      });

      currentBlock = toBlock + 1n;
   }

   return events;
};

const saveClaimedEventsToFile = (events: ClaimEvent[]) => {
   const directoryPath = './data';
   const filePath = `${directoryPath}/claimed-events.json`;

   if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
   }

   const jsonData = JSON.stringify(events, null, 2);
   fs.writeFileSync(filePath, jsonData, 'utf-8');
};

export async function GET(): Promise<NextResponse<ApiResponse>> {
   try {
      const events = await fetchClaimedEvents();

      saveClaimedEventsToFile(events);

      return NextResponse.json({ events });
   } catch (error) {
      console.error('Error fetching or saving claimed events:', error);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
   }
}