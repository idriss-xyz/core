import { Command } from 'shared/messaging';

export class GetAvailabilityCommand extends Command<Record<string, never>> {
  public readonly name = 'GetAvailabilityCommand' as const;
  public id: string;

  constructor(public details: Record<string, never>) {
    super();
    this.id = this.name;
  }
}
