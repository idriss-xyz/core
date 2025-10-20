import { ponder } from 'ponder:registry';
import { storeTipMessage } from './store-tip-message.js';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

async function handleTipMessage({ event, context }: any) {
  const saved = await storeTipMessage({
    chainId: context.chain.id,
    txHash: event.transaction.hash,
    blockTimestamp: event.block.timestamp * BigInt(1000),
    args: {
      sender: event.args.sender,
      recipientAddress: event.args.recipientAddress,
      tokenAddress: event.args.tokenAddress,
      amount: event.args.amount,
      fee: event.args.fee,
      assetType: Number(event.args.assetType),
      assetId: event.args.assetId,
      message: event.args.message,
    },
  });
}

ponder.on('idrissTippingBase:TipMessage', handleTipMessage);
ponder.on('idrissTippingEthereum:TipMessage', handleTipMessage);
// ponder.on('idrissTippingRonin:TipMessage', handleTipMessage);
// ponder.on('idrissTippingAbstract:TipMessage', handleTipMessage);
// ponder.on('idrissTippingAvalanche:TipMessage', handleTipMessage);
