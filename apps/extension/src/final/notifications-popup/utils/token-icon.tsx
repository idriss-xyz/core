import { Icon } from '@idriss-xyz/ui/icon';
import { SwapDataToken } from 'application/trading-copilot';
import { useEffect, useState } from 'react';

interface TokenIconProperties {
  tokenData: SwapDataToken | null;
  tokenImage: string;
}

export const TokenIcon: React.FC<TokenIconProperties> = ({
  tokenImage,
  tokenData,
}) => {
  const [icon, setIcon] = useState<JSX.Element | null>(null);

  const tokenImageArray = tokenImage.split('/');
  const isCorrectImage = tokenImageArray[0] === 'data:image';

  useEffect(() => {
    const loadIcon = () => {
      if (tokenImage === 'IdrissToken') {
        setIcon(
          <Icon name="IdrissToken" size={24} className="size-6 rounded-full" />,
        );
      } else {
        if (tokenData && isCorrectImage) {
          setIcon(
            <img
              src={tokenImage}
              alt={tokenData.symbol}
              className="size-6 rounded-full"
            />,
          );
        } else {
          setIcon(null);
        }
      }
    };

    loadIcon();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenImage, tokenData]);

  return icon;
};
