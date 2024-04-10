import { Command } from './command';
import { FailureResult, OkResult } from './result';

export abstract class Handler<ResultData = unknown> {
  abstract handle(
    command: Command,
  ): Promise<OkResult<ResultData> | FailureResult>;
}
