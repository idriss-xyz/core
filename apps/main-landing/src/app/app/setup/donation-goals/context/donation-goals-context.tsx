'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';

import { useAuth } from '@/app/context/auth-context';
import { useGetDonationGoals } from '@/app/app/commands/get-donation-goals';
import { useGetActiveDonationGoal } from '@/app/app/commands/get-active-donation-goal';

interface DonationGoalsContextValue {
  activeGoal: ReturnType<typeof useGetActiveDonationGoal>['data'];
  inactiveGoals: ReturnType<typeof useGetDonationGoals>['data'];
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const DonationGoalsContext = createContext<DonationGoalsContextValue | null>(
  null,
);

interface DonationGoalsProviderProperties {
  children: ReactNode;
}

export function DonationGoalsProvider({
  children,
}: DonationGoalsProviderProperties) {
  const { creator } = useAuth();
  const { ready, authenticated } = usePrivy();

  const activeGoalQuery = useGetActiveDonationGoal(creator?.name, {
    enabled: ready && authenticated && !!creator?.name,
  });

  const goalListQuery = useGetDonationGoals(creator?.name, {
    enabled: ready && authenticated && !!creator?.name,
  });

  const inactiveGoals = (goalListQuery.data ?? []).filter((goal) => {
    return !goal.active;
  });

  const refetch = async () => {
    await Promise.all([activeGoalQuery.refetch(), goalListQuery.refetch()]);
  };

  const value: DonationGoalsContextValue = {
    activeGoal: activeGoalQuery.data,
    inactiveGoals,
    isLoading: activeGoalQuery.isLoading || goalListQuery.isLoading,
    refetch,
  };

  return (
    <DonationGoalsContext.Provider value={value}>
      {children}
    </DonationGoalsContext.Provider>
  );
}

export function useDonationGoals() {
  const context = useContext(DonationGoalsContext);
  if (!context) {
    throw new Error(
      'useDonationGoals must be used within a DonationGoalsProvider',
    );
  }
  return context;
}
