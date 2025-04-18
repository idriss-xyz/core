import fs from 'node:fs';

import {
  ClaimEvent,
  CLAIMED_EVENTS_FILE_PATH,
  STARTING_BLOCK_CLAIMED,
} from '@/constants';

export function loadExistingEvents(): {
  events: ClaimEvent[];
  lastProcessedBlock: bigint;
} {
  if (fs.existsSync(CLAIMED_EVENTS_FILE_PATH)) {
    const data = JSON.parse(fs.readFileSync(CLAIMED_EVENTS_FILE_PATH, 'utf8'));
    return {
      events: data.events ?? [],
      lastProcessedBlock: data.lastProcessedBlock
        ? BigInt(data.lastProcessedBlock)
        : STARTING_BLOCK_CLAIMED,
    };
  }
  return { events: [], lastProcessedBlock: STARTING_BLOCK_CLAIMED };
}
