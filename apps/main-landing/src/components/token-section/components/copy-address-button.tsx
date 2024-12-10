'use client';

import { useState } from 'react';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Icon } from '@idriss-xyz/ui/icon';

import { formatAddress } from '../utils';
import { IDRISS_TOKEN_ADDRESS } from '../constants';

export const CopyAddressButton = () => {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(IDRISS_TOKEN_ADDRESS);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className='p-3'>
        <Icon name="BaseLogo" size={24} className="size-5 lg:size-6" />
      </div>
      <span className="min-w-[130px] text-center text-body3 text-neutralGreen-900 lg:text-body2">
        {copied ? 'Copied!' : formatAddress(IDRISS_TOKEN_ADDRESS)}
      </span>
      <IconButton
        className="text-neutral-600"
        iconClassName="size-5 lg:size-6"
        iconName="Copy"
        intent="tertiary"
        size="medium"
        onClick={copyAddress}
      />
    </div>
  );
};
