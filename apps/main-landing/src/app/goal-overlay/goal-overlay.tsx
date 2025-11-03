'use client';

import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { CREATOR_API_URL, StoredDonationData } from '@idriss-xyz/constants';
import { ProgressBarV2 } from '@idriss-xyz/ui/progress-bar-v2';
import { classes } from '@idriss-xyz/ui/utils';
import { Icon } from '@idriss-xyz/ui/icon';
import { Badge } from '@idriss-xyz/ui/badge';
import { formatFiatValue } from '@idriss-xyz/utils';

import { getTimeRemaining } from '@/app/utils';

import { useGetActiveDonationGoal } from '../app/commands/get-active-donation-goal';

interface Properties {
  creatorName?: string;
  creatorAddress: string;
}

// ts-unused-exports:disable-next-line
export default function GoalOverlay({
  creatorName,
  creatorAddress,
}: Properties) {
  const [recentDonationAmount, setRecentDonationAmount] = useState<
    number | null
  >(null);
  const activeGoalQuery = useGetActiveDonationGoal(creatorName);
  const activeGoal = activeGoalQuery.data;

  const progressPercentage = activeGoal
    ? Math.min((activeGoal.progress / activeGoal.targetAmount) * 100, 100)
    : 0;
  const isCompleted = progressPercentage >= 100;

  useEffect(() => {
    if (!activeGoal) {
      return;
    }
    if (!creatorName) return;

    const overlayToken = window.location.pathname.split('/').pop()!;

    const socket: Socket = io(`${CREATOR_API_URL}/overlay`, {
      auth: { overlayToken },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ DonationGoal overlay socket connected');
    });

    socket.on('forceRefresh', () => {
      console.log('Got force refresh');
      const url = new URL(window.location.href);
      url.searchParams.set('t', Date.now().toString());
      window.location.href = url.toString();
    });

    socket.on('connect_error', (error) => {
      console.error('DonationGoal overlay auth failed:', error.message);
    });

    socket.on('newDonation', async (donation: StoredDonationData) => {
      try {
        // Check if this donation should update our goal
        if (
          donation.toAddress.toLowerCase() !== creatorAddress?.toLowerCase()
        ) {
          return;
        }

        // Update the goal progress with the new donation amount
        await activeGoalQuery.refetch();

        // For new donation chip
        setRecentDonationAmount(donation.tradeValue);
      } catch (error) {
        console.error(
          'Failed to handle newDonation event in goal overlay:',
          error,
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [creatorName, creatorAddress, activeGoal, activeGoalQuery]);

  useEffect(() => {
    if (recentDonationAmount !== null) {
      const timer = setTimeout(() => {
        setRecentDonationAmount(null);
      }, 6000);

      return () => {
        return clearTimeout(timer);
      };
    }
    return;
  }, [recentDonationAmount]);

  return (
    <>
      <style>{`
        html {
          /* 16px at 450px width (450 / 16 = 28.125) */
          font-size: calc(100vw / 28.125);
        }
      `}</style>
      {activeGoal && (
        <div className="flex h-screen w-screen items-center justify-center bg-transparent p-6">
          <div className="flex w-full max-w-md flex-col gap-6 rounded-lg border bg-white/90 p-4">
            {/* DonationGoal name and incoming donation chip*/}
            <div className="flex w-full items-center">
              <div className="flex min-h-[36px] grow items-center">
                <h2
                  className={classes(
                    'text-center text-heading5 text-neutralGreen-900',
                  )}
                >
                  {activeGoal.name}
                </h2>
              </div>
              {recentDonationAmount && (
                <div
                  key={recentDonationAmount} // Forces re-mount for each new donation
                  className="flex animate-slide-in-from-right items-center justify-end gap-2 rounded-full bg-mint-400 py-1.5 pl-1 pr-3 transition-all"
                >
                  <div className="flex size-6 items-center justify-center rounded-full bg-mint-200">
                    <Icon name="Check" className="text-mint-500" size={20} />
                  </div>
                  <span className="text-label4">
                    ${Number(recentDonationAmount).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar and info*/}
            <div className="flex flex-col gap-2">
              <div className="h-4">
                <ProgressBarV2 progress={progressPercentage} />
              </div>
              <div className="flex items-center justify-between text-label4">
                <Badge type="success" variant="subtle" className="w-fit">
                  {progressPercentage >= 100 ? (
                    <p className="capitalize">Completed</p>
                  ) : (
                    <p className="lowercase">
                      {getTimeRemaining(activeGoal.endDate)}
                    </p>
                  )}
                </Badge>
                <span
                  className={classes(
                    isCompleted ? 'text-mint-600' : 'text-neutral-900',
                  )}
                >
                  $
                  {Number(
                    activeGoal.progress >= activeGoal.targetAmount
                      ? activeGoal.targetAmount
                      : activeGoal.progress,
                  ).toFixed(2)}
                  /$
                  {activeGoal.targetAmount} ({progressPercentage.toFixed(0)}%)
                </span>
              </div>
            </div>

            {/* Top donor */}
            <div className="flex items-center gap-2 text-label4">
              <Icon name="Users2" size={20} />
              <span className="text-neutral-600">Top donor:</span>
              {activeGoal.topDonor.name?.trim() ? (
                <span className="text-neutral-900">
                  {activeGoal.topDonor.name} ($
                  {formatFiatValue(Number(activeGoal.topDonor.amount))})
                </span>
              ) : (
                <span className="text-neutral-900">–</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
