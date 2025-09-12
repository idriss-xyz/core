import Image from 'next/image';
import { Icon, type IconName } from '@idriss-xyz/ui/icon';

const symbolToIconNameMap: Record<string, IconName> = {
  ETH: 'EthToken',
  USDC: 'UsdcToken',
  IDRISS: 'IdrissToken',
  PDT: 'PdtToken',
  RON: 'RoninToken',
  YGG: 'YggToken',
  AVAX: 'AvaxToken',
  GUN: 'GunToken',
};

interface TokenLogoProperties {
  symbol: string;
  imageUrl?: string;
}

export const TokenLogo = ({ symbol, imageUrl }: TokenLogoProperties) => {
  const iconName = symbolToIconNameMap[symbol];

  if (iconName) {
    return <Icon name={iconName} className="size-full" />;
  }

  if (imageUrl) {
    return <Image src={imageUrl} alt={symbol} fill className="rounded-full" />;
  }
  return <Icon name="IdrissToken" className="size-full" />;
};
