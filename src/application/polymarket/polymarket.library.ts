import { BookItem } from './polymarket.types';

export const calculateTotalSharesForAmount = (
  asks: BookItem[],
  balance: number,
): number => {
  let totalSpent = 0;
  let totalShares = 0;

  const sortedAsks = [...asks].sort((a, b) => {
    return Number(a.price) - Number(b.price);
  });

  for (const ask of sortedAsks) {
    const price = Number(ask.price);
    const size = Number(ask.size);
    const costForAllSharesAtThisPrice = price * size;
    if (totalSpent + costForAllSharesAtThisPrice <= balance) {
      totalSpent += costForAllSharesAtThisPrice;
      totalShares += size;
    } else {
      const remainingBalance = balance - totalSpent;
      const sharesToBuy = remainingBalance / price;
      totalSpent += sharesToBuy * price;
      totalShares += sharesToBuy;
      break;
    }
  }

  return totalShares;
};
