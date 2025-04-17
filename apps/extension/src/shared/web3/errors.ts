import { CustomError } from 'ts-custom-error';

type Properties = {
  transactionHash: string;
};

export class TransactionRevertedError extends CustomError {
  constructor(public properties: Properties) {
    super();
  }
}
