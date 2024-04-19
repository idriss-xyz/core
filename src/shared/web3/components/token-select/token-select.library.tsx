import { ETHEREUM_LOGO } from 'shared/web3/web3.constants';

export const getOptions = () => {
  return [
    {
      label: 'Ethereum',
      value: 'ETH',
      prefix: <img src={ETHEREUM_LOGO} className="size-4" alt="" />,
    },
  ];
};
