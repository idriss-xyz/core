'use client';

import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { ProgressBarV2 } from '@idriss-xyz/ui/progress-bar-v2';
import { classes } from '@idriss-xyz/ui/utils';
import { Icon } from '@idriss-xyz/ui/icon';
import { Badge } from '@idriss-xyz/ui/badge';

import { getTimeRemaining } from '../utils';
import { DonationGoal } from '../utils/types';

interface Properties {
  creatorName?: string;
}

// ts-unused-exports:disable-next-line
export default function GoalOverlay({ creatorName }: Properties) {
  const [goalData, setGoalData] = useState<DonationGoal>({
    id: 1,
    name: 'New Gaming Setup',
    progress: 320,
    targetAmount: 500,
    startDate: 1_742_807_935_000,
    endDate: 1_752_807_935_000,
    topDonor: { name: 'geoist_', amount: 50 },
  });

  const progressPercentage = Math.min(
    (goalData.progress / goalData.targetAmount) * 100,
    100,
  );

  useEffect(() => {
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

    socket.on('goalDataUpdated', (data: DonationGoal) => {
      console.log('Got new goal data', data);
      setGoalData(data);
    });

    socket.on('connect_error', (error) => {
      console.error('DonationGoal overlay auth failed:', error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [creatorName]);

  return (
    <>
      <style>{`
        html {
          /* 16px at 450px width (450 / 16 = 28.125) */
          font-size: calc(100vw / 28.125);
        }
      `}</style>
      <div className="flex h-screen w-screen items-center justify-center bg-transparent p-6">
        <div className="flex w-full max-w-md flex-col gap-6 rounded-lg border bg-white/90 p-4">
          {/* DonationGoal name and incoming donation chip*/}
          <div className="flex w-full items-center">
            <div className="flex grow items-center">
              <h2
                className={classes(
                  'text-center text-heading5 text-neutralGreen-900',
                )}
              >
                {goalData.name}
              </h2>
            </div>
            <div className="flex items-center justify-end gap-2 rounded-full bg-mint-400 py-1.5 pl-1 pr-3">
              <div className="flex size-6 items-center justify-center rounded-full bg-mint-200">
                <Icon name="Check" className="text-mint-500" size={20} />
              </div>
              <span className="text-label4">$20</span>{' '}
              {/* TODO: Replace for incoming donation amounts*/}
            </div>
          </div>

          {/* Progress Bar and info*/}
          <div className="flex flex-col gap-2">
            <div className="h-4">
              <ProgressBarV2 progress={progressPercentage} />
            </div>
            <div className="flex items-center justify-between text-label4">
              <Badge
                type="success"
                variant="subtle"
                className="w-fit lowercase"
              >
                {getTimeRemaining(goalData.endDate)}
              </Badge>
              <span className="text-neutral-900">
                ${goalData.progress}/${goalData.targetAmount} (
                {progressPercentage.toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Top donor */}
          <div className="flex items-center gap-2 text-label4">
            <Icon name="Users2" size={20} />
            <span className="text-neutral-600">Top donor:</span>
            <span className="text-neutral-900">
              {goalData.topDonor.name} (${goalData.topDonor.amount})
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
