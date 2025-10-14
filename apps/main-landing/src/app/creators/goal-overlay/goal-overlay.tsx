'use client';

import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { ProgressBarV2 } from '@idriss-xyz/ui/progress-bar-v2';
import { classes } from '@idriss-xyz/ui/utils';

interface Properties {
  creatorName?: string;
}

interface GoalData {
  goalName: string;
  progress: number;
  target: number;
  daysLeft: number;
  topDonor: string;
}

// ts-unused-exports:disable-next-line
export default function GoalOverlay({ creatorName }: Properties) {
  const [goalData, setGoalData] = useState<GoalData>({
    goalName: 'New Gaming Setup',
    progress: 1250,
    target: 5000,
    daysLeft: 15,
    topDonor: 'CryptoFan123',
  });

  const progressPercentage = Math.min(
    (goalData.progress / goalData.target) * 100,
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
      console.log('✅ Goal overlay socket connected');
    });

    socket.on('forceRefresh', () => {
      console.log('Got force refresh');
      const url = new URL(window.location.href);
      url.searchParams.set('t', Date.now().toString());
      window.location.href = url.toString();
    });

    socket.on('goalDataUpdated', (data: GoalData) => {
      console.log('Got new goal data', data);
      setGoalData(data);
    });

    socket.on('connect_error', (error) => {
      console.error('Goal overlay auth failed:', error.message);
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
        <div className="w-full max-w-md rounded-lg bg-white/90 p-6 shadow-lg backdrop-blur-sm">
          {/* Goal Name */}
          <h2
            className={classes(
              'mb-4 text-center text-heading6 font-semibold text-neutralGreen-700',
            )}
          >
            {goalData.goalName}
          </h2>

          {/* Progress Bar */}
          <div className="mb-4 h-9">
            <ProgressBarV2 progress={progressPercentage} />
          </div>

          {/* Progress Info */}
          <div className="space-y-2 text-center">
            <p
              className={classes(
                'text-neutralGreen-600 text-body4 font-medium',
              )}
            >
              ${goalData.progress.toLocaleString()} / $
              {goalData.target.toLocaleString()} (
              {progressPercentage.toFixed(0)}%)
            </p>

            <p className={classes('text-body5 text-neutralGreen-500')}>
              {goalData.daysLeft} days left
            </p>

            <p className={classes('text-body5 text-neutralGreen-500')}>
              Top donor:{' '}
              <span className="font-medium">{goalData.topDonor}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
