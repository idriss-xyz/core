import { onchainTable } from 'ponder';

export const tipMessage = onchainTable('tip_message', (t) => ({
  id: t.text().primaryKey(), // event id
  chainId: t.integer().notNull(),
  txHash: t.hex().notNull(),
  sender: t.hex().notNull(),
  recipient: t.hex().notNull(),
  token: t.hex().notNull(),
  amount: t.numeric().notNull(),
  fee: t.numeric().notNull(),
  assetType: t.integer().notNull(),
  assetId: t.numeric().notNull(),
  message: t.text().notNull(),
  timestamp: t.bigint().notNull(),
}));
