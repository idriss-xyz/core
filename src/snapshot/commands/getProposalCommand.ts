type Details = {
  snapshotName: string;
};

export class GetProposalCommand {
  static commandName = 'GetProposalCommand';
  public name: string;
  public id: string;

  constructor(public details: Details) {
    this.name = GetProposalCommand.name;
    this.id = `${this.name}-${details.snapshotName}`;
  }
}
