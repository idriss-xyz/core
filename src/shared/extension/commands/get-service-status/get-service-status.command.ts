import { Command } from 'shared/messaging';

export class GetServiceStatusCommand extends Command<
  Record<string, never>,
  Record<string, boolean>
> {
  public readonly name = 'GetServiceStatusCommand' as const;
  public id: string;

  constructor(public details: Record<string, never>) {
    super();
    this.id = this.name;
  }
}
