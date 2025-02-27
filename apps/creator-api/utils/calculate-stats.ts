import { ZapperNode, TokenDisplayItem, DonationStats, TokenV2 } from '../types';
import { formatUnits } from 'viem';

export function calculateStatsForDonorAddress(
  zapperNodes: ZapperNode[],
): DonationStats {
  const totalDonationsCount = zapperNodes.length;
  let totalDonationAmount = 0;
  const addressFrequency: Record<string, number> = {};
  const tokenFrequency: Record<string, number> = {};
  let biggestDonationAmount = 0;
  let mostDonatedToAddress = '';
  let favoriteDonationToken = '';
  let favoriteTokenMetadata: Omit<TokenV2, 'onchainMarketData'> | null = null;
  let donorDisplayName: string | null = null;

  zapperNodes.forEach((zapperNode) => {
    const toAddress = zapperNode.transaction.toUser.address;
    const tokenDisplayItem = zapperNode.interpretation
      .descriptionDisplayItems[0] as TokenDisplayItem;

    const amountRaw = tokenDisplayItem?.amountRaw;
    const price = tokenDisplayItem?.tokenV2?.onchainMarketData?.price;
    const decimals = tokenDisplayItem?.tokenV2?.decimals ?? 18;

    const tradeValue =
      Number.parseFloat(formatUnits(BigInt(amountRaw), decimals)) * price;

    totalDonationAmount += tradeValue;

    addressFrequency[toAddress] = (addressFrequency[toAddress] || 0) + 1;
    if (
      addressFrequency[toAddress] >
      (addressFrequency[mostDonatedToAddress] || 0)
    ) {
      mostDonatedToAddress = toAddress;
    }

    const tokenSymbol = tokenDisplayItem.tokenV2.symbol;
    tokenFrequency[tokenSymbol] = (tokenFrequency[tokenSymbol] || 0) + 1;
    if (
      tokenFrequency[tokenSymbol] > (tokenFrequency[favoriteDonationToken] || 0)
    ) {
      favoriteDonationToken = tokenSymbol;
      favoriteTokenMetadata = {
        symbol: tokenDisplayItem.tokenV2.symbol,
        imageUrlV2: tokenDisplayItem.tokenV2.imageUrlV2,
        address: tokenDisplayItem.tokenV2.address,
        decimals: tokenDisplayItem.tokenV2.decimals,
      };
    }

    if (tradeValue > biggestDonationAmount) {
      biggestDonationAmount = tradeValue;
    }

    if (!donorDisplayName) {
      donorDisplayName = zapperNode.transaction.fromUser.displayName.value;
    }
  });

  return {
    totalDonationsCount,
    totalDonationAmount,
    mostDonatedToAddress,
    biggestDonationAmount,
    favoriteDonationToken,
    favoriteTokenMetadata,
    donorDisplayName,
  };
}
