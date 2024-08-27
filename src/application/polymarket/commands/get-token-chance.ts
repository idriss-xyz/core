import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';

import { POLYMARKET_CLOB_API } from '../constants';

interface Payload {
  tokenId: string;
}

export class GetTokenChanceCommand extends Command<Payload, number> {
  public readonly name = 'GetTokenChanceCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(
        `${POLYMARKET_CLOB_API}/midpoint?token_id=${this.payload.tokenId}`,
      );

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }
      // TODO: validate response
      const json = (await response.json()) as { mid: string };
      return new OkResult(
        Number((Math.round(Number(json.mid) * 100) / 100).toFixed(2)),
      );
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
