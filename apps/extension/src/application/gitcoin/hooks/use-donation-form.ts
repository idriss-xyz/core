import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';

import { dollarToWei } from 'shared/web3';

import { Application, DonationPayload } from '../types';
import { getDefaultDonationOptions } from '../utils';
import { createDonationPayloadSchema } from '../schema';
import { GITCOIN_DONATION_CHAINS_IDS } from '../constants';

interface Properties {
  application: Application;
  ethPerDollar: number;
}

export const useDonationForm = ({ application, ethPerDollar }: Properties) => {
  const [isCrossChain, setIsCrossChain] = useState(false);

  const formMethods = useForm<DonationPayload>({
    defaultValues: getDefaultDonationOptions(application),
    resolver: zodResolver(createDonationPayloadSchema(isCrossChain)),
  });

  const [amount, chainId] = formMethods.watch(['amount', 'chainId']);
  const [debouncedAmount, setDebouncedAmount] = useState(amount);

  useDebounce(
    () => {
      setDebouncedAmount(amount);
    },
    500,
    [amount],
  );

  const userAmountInWei = dollarToWei(debouncedAmount, ethPerDollar);

  const chainIdOptions = useMemo(() => {
    return GITCOIN_DONATION_CHAINS_IDS.sort((id) => {
      return id === application.chainId ? -1 : 0;
    });
  }, [application.chainId]);

  const onChangeChainId = useCallback(
    (id: number) => {
      setIsCrossChain(id !== application.chainId);
    },
    [application.chainId],
  );

  useEffect(() => {
    void formMethods.trigger();
  }, [formMethods, isCrossChain]);

  return {
    amount,
    chainId,
    chainIdOptions,
    formMethods,
    isCrossChain,
    debouncedAmount,
    userAmountInWei,
    onChangeChainId,
  };
};
