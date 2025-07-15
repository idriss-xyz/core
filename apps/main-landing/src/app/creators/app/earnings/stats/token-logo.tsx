import Image, { type StaticImageData } from 'next/image';

import {
  ETHEREUM_LOGO,
  IDRISS_LOGO,
  PDT_LOGO,
  ECHELON_PRIME_LOGO,
  RONIN_LOGO,
  USDC_LOGO,
  YGG_LOGO,
} from '@/assets';

// The map now holds image data objects, not components
const logoMap: Record<string, StaticImageData> = {
  ETH: ETHEREUM_LOGO,
  USDC: USDC_LOGO,
  PRIME: ECHELON_PRIME_LOGO,
  IDRISS: IDRISS_LOGO,
  PDT: PDT_LOGO,
  RON: RONIN_LOGO,
  YGG: YGG_LOGO,
};

interface TokenLogoProperties {
  symbol: string;
  imageUrl?: string;
}

export const TokenLogo = ({ symbol, imageUrl }: TokenLogoProperties) => {
  const logoData = logoMap[symbol];

  // Priority 1: Render the local SVG using an <Image> tag
  if (logoData) {
    return (
      <Image
        src={logoData.src} // Use the .src property of the imported object
        alt={symbol}
        fill
        className="rounded-full"
      />
    );
  }

  // Priority 2: Fall back to the imageUrl from the API
  if (imageUrl) {
    return <Image src={imageUrl} alt={symbol} fill className="rounded-full" />;
  }

  // Priority 3: Render a default placeholder
  return (
    <Image
      src={logoMap.IDRISS!.src}
      alt={symbol}
      fill
      className="rounded-full"
    />
  );
};
