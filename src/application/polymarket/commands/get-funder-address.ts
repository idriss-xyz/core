import {
  Command,
  FailureResult,
  HandlerError,
  HandlerResponseError,
  OkResult,
} from 'shared/messaging';
import { Hex, hexSchema } from 'shared/web3';

interface Payload {
  address: Hex;
}

export class GetFunderAddresCommand extends Command<Payload, Hex> {
  public name = 'GetFunderAddresCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(
        `https://safe-transaction-polygon.safe.global/api/v1/owners/${this.payload.address}/safes/`,
      );

      if (!response.ok) {
        const responseText = await response.text();
        throw new HandlerResponseError(
          this.name,
          responseText,
          response.status,
        );
      }
      const { safes } = (await response.json()) as { safes: string[] };
      const safesCreationResponse = await Promise.all(
        safes.map(async (safe) => {
          const response = await fetch(
            `https://safe-transaction-polygon.safe.global/api/v1/safes/${safe}/creation/`,
          );
          const json = (await response.json()) as { factoryAddress: string };
          if (
            json.factoryAddress === '0xaacFeEa03eb1561C4e67d661e40682Bd20E3541b'
          ) {
            return safe;
          }
          return;
        }),
      );
      const safesCreatedByPolymarket = safesCreationResponse.find(Boolean);
      const pickedSafe = safesCreatedByPolymarket;
      if (!pickedSafe) {
        throw new HandlerError();
      }
      const validationResult = hexSchema.safeParse(pickedSafe);
      if (!validationResult.success) {
        throw new HandlerError('Schema validation failed');
      }
      return new OkResult(validationResult.data);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
