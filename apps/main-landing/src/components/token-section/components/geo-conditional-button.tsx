'use client';

import { Spinner } from '@idriss-xyz/ui/spinner';

import { restrictedCountries } from '@/constants';

import { useGeoLocation } from '../hooks/use-geo-location';

import { BlockedButton } from './blocked-button';

type GeoConditionalButtonProperties = {
  defaultButton: React.ReactNode;
};

export const GeoConditionalButton: React.FC<GeoConditionalButtonProperties> = ({
  defaultButton,
}) => {
  const { country, loading } = useGeoLocation();

  if (loading) {
    return (
      <Spinner className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" />
    );
  }

  if (!country || restrictedCountries.includes(country)) {
    return <BlockedButton />;
  }

  return defaultButton;
};
