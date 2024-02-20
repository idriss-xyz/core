type Details = {
  snapshotNames: string[];
};

export class GetProposalsCommand {
  static commandName = 'GetProposalsCommand';
  public name: string;
  public id: string;

  constructor(public details: Details) {
    this.name = GetProposalsCommand.name;
    this.id = `${this.name}-${details.snapshotNames.join('-')}`;
  }
}
