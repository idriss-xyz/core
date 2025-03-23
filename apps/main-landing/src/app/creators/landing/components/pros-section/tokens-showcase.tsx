import { Icon } from '@idriss-xyz/ui/icon';
import { Marquee } from '@idriss-xyz/ui/marquee';
import { classes } from '@idriss-xyz/ui/utils';

type Properties = {
  className?: string;
};

const tokens = [
  {
    name: 'Solana',
    icon: <Icon name="EthCircled" size={60} />,
  },
  {
    name: 'Shiba',
    icon: <Icon name="EthCircled" size={60} />,
  },
  {
    name: 'Bitcoin',
    icon: <Icon name="EthCircled" size={60} />,
  },
  {
    name: 'USD',
    icon: <Icon name="EthCircled" size={60} />,
  },
  {
    name: 'Polkadot',
    icon: <Icon name="EthCircled" size={60} />,
  },
];

const tokens2 = [
  {
    name: 'Solana',
    icon: <Icon name="EthCircled" size={60} />,
  },
  {
    name: 'Shiba',
    icon: <Icon name="EthCircled" size={60} />,
  },
  {
    name: 'Bitcoin',
    icon: <Icon name="EthCircled" size={60} />,
  },
  {
    name: 'USD',
    icon: <Icon name="EthCircled" size={60} />,
  },
  {
    name: 'Polkadot',
    icon: <Icon name="EthCircled" size={60} />,
  },
];

export const TokensShowcase = ({ className }: Properties) => {
  return (
    <div
      className={classes(
        'z-1 flex w-full flex-col items-center justify-center gap-4 lg:gap-8',
        className,
      )}
    >
      <Marquee
        className="container"
        items={tokens.map((token) => {
          return token.icon;
        })}
      />

      <Marquee
        className="container"
        sliderClassName="ml-[60px]"
        items={tokens2.map((token) => {
          return token.icon;
        })}
      />
    </div>
  );
};
