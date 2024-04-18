import { Command } from 'shared/messaging';

import { ProposalData } from '../types';

interface Details {
  snapshotName: string;
}

export class GetProposalCommand extends Command<Details, ProposalData> {
  public readonly name = 'GetProposalCommand' as const;
  public readonly id: string;

  constructor(public details: Details) {
    super();
    this.id = `${this.name}-${details.snapshotName}`;
  }
}
