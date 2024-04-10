import { Command } from 'shared/messaging';

interface Details {
  snapshotName: string;
}

export class GetProposalCommand extends Command<Details> {
  public readonly name = 'GetProposalCommand' as const;
  public readonly id: string;

  constructor(public details: Details) {
    super();
    this.id = `${this.name}-${details.snapshotName}`;
  }
}
