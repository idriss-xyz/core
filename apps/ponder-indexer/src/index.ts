import { ponder } from 'ponder:registry';
import { storeTipMessage } from '@idriss-xyz/db';

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

  if (saved) {
    // Fire-and-forget push to backend to broadcast over overlay WS
    fetch(`${process.env.CREATOR_API_URL}/internal/events/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_SYNC_TOKEN}`,
      },
      body: JSON.stringify(saved),
    }).catch((e) => console.warn('notify donation failed', e));
  }
}

ponder.on('idrissTippingBase:TipMessage', handleTipMessage);
ponder.on('idrissTippingEthereum:TipMessage', handleTipMessage);
// ponder.on('idrissTippingRonin:TipMessage', handleTipMessage);
// ponder.on('idrissTippingAbstract:TipMessage', handleTipMessage);
// ponder.on('idrissTippingAvalanche:TipMessage', handleTipMessage);
