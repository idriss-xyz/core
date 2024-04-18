import { Command } from 'shared/messaging';

import {
  GetAcrossChainFeeCommandDetails,
  GetAcrossChainFeeResponse,
} from './get-across-chain-fee.types';

export class GetAcrossChainFeeCommand extends Command<
  GetAcrossChainFeeCommandDetails,
  GetAcrossChainFeeResponse
> {
  public readonly name = 'GetAcrossChainFeeCommand' as const;
  public readonly id: string;

  constructor(public details: GetAcrossChainFeeCommandDetails) {
    super();
    this.id = `${this.name}-${JSON.stringify(this.details)}`;
  }
}
