import { CustomError } from 'ts-custom-error';

import { Hex } from './types';

type Properties = {
  transactionHash: Hex;
};

export class TransactionRevertedError extends CustomError {
  constructor(public properties: Properties) {
    super();
  }
}
