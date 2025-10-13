import { ponder } from 'ponder:registry';
import { tipMessage } from 'ponder:schema';

async function handleTipMessage({ event, context }: any) {
  const chainId = context.chain.id;

  await context.db.insert(tipMessage).values({
    id: `${chainId}-${event.log.logIndex}-${event.transaction.hash}`,
    chainId,
    txHash: event.transaction.hash,
    sender: event.args.sender,
    recipient: event.args.recipientAddress,
    token: event.args.tokenAddress,
    amount: event.args.amount.toString(),
    fee: event.args.fee.toString(),
    assetType: event.args.assetType,
    assetId: event.args.assetId.toString(),
    message: event.args.message,
    timestamp: event.block.timestamp,
  });
}

ponder.on('idrissTippingBase:TipMessage', handleTipMessage);
ponder.on('idrissTippingEthereum:TipMessage', handleTipMessage);
