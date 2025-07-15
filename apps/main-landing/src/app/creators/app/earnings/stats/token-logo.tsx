import Image from 'next/image';
import { Icon, type IconName } from '@idriss-xyz/ui/icon';

// This map translates a token symbol (from the API) to an IconName
const symbolToIconNameMap: Record<string, IconName> = {
  ETH: 'Eth',
  USDC: 'UsdcToken',
  PRIME: 'PrimeToken',
  IDRISS: 'IdrissToken',
  PDT: 'PdtToken',
  RON: 'RoninToken',
  YGG: 'YggToken',
};

interface TokenLogoProperties {
  symbol: string;
  imageUrl?: string;
}

export const TokenLogo = ({ symbol, imageUrl }: TokenLogoProperties) => {
  const iconName = symbolToIconNameMap[symbol];

  // Priority 1: If we have a matching icon name, use the generic Icon component
  if (iconName) {
    return <Icon name={iconName} className="size-full" />;
  }

  // Priority 2: Fall back to the imageUrl from the API
  if (imageUrl) {
    return <Image src={imageUrl} alt={symbol} fill className="rounded-full" />;
  }

  // Priority 3: Render a default placeholder using the Icon component
  // Also pass the size prop to the fallback icon
  return <Icon name="IdrissToken" className="size-full" />;
};
