import { CustomError } from 'ts-custom-error';
import { Hex } from 'viem';

type Properties = {
  transactionHash: Hex;
};

export class TransactionRevertedError extends CustomError {
  constructor(public properties: Properties) {
    super();
  }
}
