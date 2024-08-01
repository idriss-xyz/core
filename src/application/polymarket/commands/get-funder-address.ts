import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

interface Payload {
  address: string;
}

export class GetFunderAddresCommand extends Command<Payload, string> {
  public name = 'GetFunderAddresCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const response = await fetch(
        `https://safe-transaction-polygon.safe.global/api/v1/owners/${this.payload.address}/safes/`,
      );

      if (response.status !== 200) {
        throw new HandlerError();
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
      return new OkResult(pickedSafe);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }
      return new FailureResult();
    }
  }
}
