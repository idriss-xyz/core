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
    <div className="flex items-center gap-2">
      <Icon name="BaseLogo" size={24} />
      <span className="min-w-[130px] text-body2 text-neutralGreen-900 text-center">
        {copied ? 'Copied!' : formatAddress(IDRISS_TOKEN_ADDRESS)}
      </span>
      <IconButton
        className="text-neutral-600"
        iconName="Copy"
        intent="tertiary"
        size="small"
        onClick={copyAddress}
      />
    </div>
  );
};
