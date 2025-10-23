import { type IconName } from '@idriss-xyz/ui/icon';
import { AssetLogo } from '@idriss-xyz/ui/asset-logo';

const symbolToIconNameMap: Record<string, IconName> = {
  ETH: 'EthToken',
  USDC: 'UsdcToken',
  IDRISS: 'IdrissToken',
  PDT: 'PdtToken',
  RON: 'RoninToken',
  YGG: 'YggToken',
  NFT: 'CardCoin',
  AVAX: 'AvaxToken',
  GUN: 'GunToken',
};

interface TokenLogoProperties {
  symbol: string;
  imageUrl?: string;
}

export const TokenLogo = ({ symbol, imageUrl }: TokenLogoProperties) => {
  const iconName = symbolToIconNameMap[symbol];

  return (
    <AssetLogo
      logo={imageUrl ?? ''}
      iconName={iconName}
      className="size-full"
      alt={symbol}
    />
  );
};
