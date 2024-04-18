import { Command } from './command';
import { Result } from './result';

type HandlerResponse<CommandImpl extends Command<unknown, unknown>> = Promise<
  Result<Awaited<ReturnType<CommandImpl['send']>>>
>;

export abstract class Handler<CommandImpl extends Command<unknown, unknown>> {
  abstract handle(command: CommandImpl): HandlerResponse<CommandImpl>;
}
