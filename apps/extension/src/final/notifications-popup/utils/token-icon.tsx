import { Icon } from '@idriss-xyz/ui/icon';
import { useEffect, useState } from 'react';

const COINGECKO_API_URL = 'https://tokens.coingecko.com/uniswap/all.json';
const IDRISS_TOKEN_ADDRESS = '0x000096630066820566162c94874a776532705231';

interface Token {
  address: string;
  symbol: string;
  logoURI: string;
}

interface TokenListResponse {
  tokens: Token[];
}

interface TokenIconProperties {
  tokenAddress: string;
}

const fetchTokenIconData = async (
  tokenAddress: string,
): Promise<Token | null> => {
  try {
    const response = await fetch(COINGECKO_API_URL);
    const tokenList = (await response.json()) as TokenListResponse;

    const tokenData = tokenList.tokens.find((t: Token) => {
      return t.address.toLowerCase() === tokenAddress.toLowerCase();
    });

    return tokenData ?? null;
  } catch (error) {
    console.error('Error fetching token icon:', error);
    return null;
  }
};

export const TokenIcon: React.FC<TokenIconProperties> = ({ tokenAddress }) => {
  const [icon, setIcon] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      if (tokenAddress.toLowerCase() === IDRISS_TOKEN_ADDRESS.toLowerCase()) {
        setIcon(<Icon name="IdrissToken" size={24} className="size-6" />);
      } else {
        const tokenData = await fetchTokenIconData(tokenAddress);
        if (tokenData) {
          setIcon(
            <img
              src={tokenData.logoURI}
              alt={tokenData.symbol}
              className="size-6"
            />,
          );
        } else {
          setIcon(null);
        }
      }
    };

    loadIcon().catch((error) => {
      console.error('Error loading token icon:', error);
    });
  }, [tokenAddress]);

  return icon;
};
