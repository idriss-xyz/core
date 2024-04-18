import { Command } from 'shared/messaging';

import { ProposalData } from '../types';

interface Details {
  snapshotNames: string[];
}

export class GetProposalsCommand extends Command<Details, ProposalData[]> {
  public readonly name = 'GetProposalsCommand' as const;
  public readonly id: string;

  constructor(public details: Details) {
    super();
    this.id = `${this.name}-${details.snapshotNames.join('-')}`;
  }
}
