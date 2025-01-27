'use client';

import { Spinner } from '@idriss-xyz/ui/spinner';

import { restrictedCountries } from '@/constants';

import { useGeoLocation } from '../hooks/use-geo-location';

import { BlockedButton } from './blocked-button';

type GeoConditionalButtonProperties = {
  defaultButton: React.ReactNode | React.ReactNode[]; // Support single or multiple buttons
  additionalClasses?: string;
};

export const GeoConditionalButton: React.FC<GeoConditionalButtonProperties> = ({
  defaultButton,
  additionalClasses = 'md:flex-row',
}) => {
  const { country, loading } = useGeoLocation();

  if (loading) {
    return (
      <Spinner className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 animate-fade-in opacity-0 [animationDelay:300ms]" />
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
      <div
        className={`flex flex-col justify-center gap-6 ${additionalClasses}`}
      >
        {defaultButton}
      </div>
    );
  }

  return defaultButton;
};
