import { useMemo } from 'react';

import { useGetServiceStatus } from 'shared/extension';

import { GitcoinApp } from './gitcoin';
import { PolymarketApp } from './polymarket';
import { SnapshotApp } from './snapshot';

export const Applications = () => {
  const serviceStatusQuery = useGetServiceStatus();

  const applicationsStatus = useMemo(() => {
    return {
      polymarket: Boolean(serviceStatusQuery.data?.polymarket),
      snapshot: Boolean(serviceStatusQuery.data?.snapshot),
      gitcoin: Boolean(serviceStatusQuery.data?.gitcoin),
    };
  }, [
    serviceStatusQuery.data?.gitcoin,
    serviceStatusQuery.data?.polymarket,
    serviceStatusQuery.data?.snapshot,
  ]);

  if (!serviceStatusQuery.data) {
    return;
  }

  return (
    <>
      {applicationsStatus.polymarket ? <PolymarketApp /> : null}
      {applicationsStatus.snapshot ? <SnapshotApp /> : null}
      {applicationsStatus.gitcoin ? <GitcoinApp /> : null}
    </>
  );
};
