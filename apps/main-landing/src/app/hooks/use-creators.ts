import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { hexSchema } from '@idriss-xyz/constants';
import { isAddress } from 'viem';

import { validateAddressOrENS } from '@/app/donate/utils';

const SEARCH_PARAMETER = {
  TOKEN: 'token',
  NETWORK: 'network',
  ADDRESS: 'address',
  CREATOR_NAME: 'creatorName',
  LEGACY_ADDRESS: 'streamerAddress',
};

export const useCreators = () => {
  const routeParameters = useParams();
  const urlSearchParameters = useSearchParams();
  const [validatedAddress, setValidatedAddress] = useState<string | null>();

  const routeAddressParameter =
    typeof routeParameters.address === 'string'
      ? routeParameters.address
      : null;
  const addressParameter = urlSearchParameters.get(SEARCH_PARAMETER.ADDRESS);
  const legacyAddressParameter = urlSearchParameters.get(
    SEARCH_PARAMETER.LEGACY_ADDRESS,
  );
  const networkParameter = urlSearchParameters.get(SEARCH_PARAMETER.NETWORK);
  const tokenParameter = urlSearchParameters.get(SEARCH_PARAMETER.TOKEN);
  const creatorNameParameter = urlSearchParameters.get(
    SEARCH_PARAMETER.CREATOR_NAME,
  );

  const addressValidationResult = hexSchema.safeParse(validatedAddress);

  const isAddressFetching = validatedAddress === undefined;
  const isAddressValid =
    !!validatedAddress &&
    isAddress(validatedAddress) &&
    addressValidationResult.success;
  const addressData = isAddressValid ? validatedAddress : null;

  useEffect(() => {
    const validateAddress = async () => {
      const address = await validateAddressOrENS(
        addressParameter ?? legacyAddressParameter ?? routeAddressParameter,
      );

      setValidatedAddress(address);
    };

    void validateAddress();
  }, [addressParameter, legacyAddressParameter, routeAddressParameter]);

  const urlParameters = {
    address: {
      data: addressData,
      isValid: isAddressValid,
      isFetching: isAddressFetching,
    },
  };

  const searchParameters = {
    token: tokenParameter,
    names: SEARCH_PARAMETER,
    network: networkParameter,
    creatorName: creatorNameParameter,
    address: {
      data: addressData,
      isValid: isAddressValid,
      isFetching: isAddressFetching,
    },
  };

  return {
    urlParams: urlParameters,
    searchParams: searchParameters,
  };
};
