import { Command } from 'shared/messaging';

interface Details {
  snapshotNames: string[];
}

export class GetProposalsCommand extends Command<Details> {
  public readonly name = 'GetProposalsCommand' as const;
  public readonly id: string;

  constructor(public details: Details) {
    super();
    this.id = `${this.name}-${details.snapshotNames.join('-')}`;
  }
}
