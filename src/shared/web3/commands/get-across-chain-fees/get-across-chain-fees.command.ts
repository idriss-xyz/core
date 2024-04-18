import { Command } from 'shared/messaging';

import {
  GetAcrossChainFeesCommandDetails,
  GetAcrossChainFeesResponse,
} from './get-across-chain-fees.types';

export class GetAcrossChainFeesCommand extends Command<
  GetAcrossChainFeesCommandDetails,
  Record<string, GetAcrossChainFeesResponse>
> {
  public readonly name = 'GetAcrossChainFeesCommand' as const;
  public readonly id: string;

  constructor(public details: GetAcrossChainFeesCommandDetails) {
    super();
    this.id = `${this.name}-${JSON.stringify(this.details)}`;
  }
}
