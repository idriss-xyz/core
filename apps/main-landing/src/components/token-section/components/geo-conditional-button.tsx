'use client';

import { Spinner } from '@idriss-xyz/ui/spinner';

import { restrictedCountries } from '@/constants';

import { useGeoLocation } from '../hooks/use-geo-location';

import { BlockedButton } from './blocked-button';

type GeoConditionalButtonProperties = {
  defaultButton: React.ReactNode | React.ReactNode[]; // Support single or multiple buttons
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

  const isRestricted = !country || restrictedCountries.includes(country);

  if (isRestricted) {
    if (Array.isArray(defaultButton)) {
      return <BlockedButton />;
    }
    return <BlockedButton />;
  }

  if (Array.isArray(defaultButton)) {
    return (
      <div className="flex flex-col justify-center gap-6 md:flex-row">
        {defaultButton}
      </div>
    );
  }

  return defaultButton;
};
