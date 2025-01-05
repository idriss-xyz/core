'use client';

import { Spinner } from '@idriss-xyz/ui/spinner';

import { restrictedCountries } from '@/constants';

import { useGeoLocation } from '../hooks/use-geo-location';

import { BlockedButton } from './blocked-button';

type GeoConditionalButtonProperties = {
  defaultButtons: React.ReactNode[];
  blockAll?: boolean; // If true, block all buttons as a group and display a single blocked button
};

export const GeoConditionalButton: React.FC<GeoConditionalButtonProperties> = ({
  defaultButtons,
  blockAll = false,
}) => {
  const { country, loading } = useGeoLocation();

  if (loading) {
    return (
      <Spinner className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" />
    );
  }

  if (blockAll) {
    // Block all buttons collectively if the condition applies
    if (!country || restrictedCountries.includes(country)) {
      return <BlockedButton />;
    }

    return (
      <div className="flex flex-col justify-center gap-6 md:flex-row">
        {defaultButtons}
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center gap-6 md:flex-row">
      {defaultButtons.map((button, index) => {return (
        <div key={index}>
          {!country || restrictedCountries.includes(country) ? (
            <BlockedButton />
          ) : (
            button
          )}
        </div>
      )})}
    </div>
  );
};
