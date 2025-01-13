import { Icon } from '@idriss-xyz/ui/icon';
import { useEffect, useState } from 'react';

import { useCommandMutation } from 'shared/messaging';
import {
  GetTokensImageCommand,
  GetTokensListCommand,
} from 'application/trading-copilot';

const IDRISS_TOKEN_ADDRESS = '0x000096630066820566162c94874a776532705231';

interface TokenIconProperties {
  tokenAddress: string;
}

export const TokenIcon: React.FC<TokenIconProperties> = ({ tokenAddress }) => {
  const [icon, setIcon] = useState<JSX.Element | null>(null);
  const tokensListMutation = useCommandMutation(GetTokensListCommand);
  const tokenImgMutation = useCommandMutation(GetTokensImageCommand);

  useEffect(() => {
    const loadIcon = async () => {
      if (tokenAddress.toLowerCase() === IDRISS_TOKEN_ADDRESS.toLowerCase()) {
        setIcon(<Icon name="IdrissToken" size={24} className="size-6" />);
      } else {
        const tokensList = await tokensListMutation.mutateAsync({
          tokenAddress,
        });
        const tokenList = tokensList?.tokens ?? [];
        const tokenData = tokenList.find((t) => {
          return t?.address?.toLowerCase() === tokenAddress.toLowerCase();
        });
        if (tokenData) {
          const tokenImg = await tokenImgMutation.mutateAsync({
            tokeURI: tokenData?.logoURI ?? '',
          });
          setIcon(
            <img src={tokenImg} alt={tokenData.symbol} className="size-6" />,
          );
        } else {
          setIcon(null);
        }
      }
    };

    loadIcon().catch((error) => {
      console.error('Error loading token icon:', error);
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress]);

  return icon;
};
