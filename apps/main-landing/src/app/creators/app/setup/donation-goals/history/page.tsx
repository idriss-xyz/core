'use client';

import { Badge } from '@idriss-xyz/ui/badge';
import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { Icon } from '@idriss-xyz/ui/icon';
import { ProgressBarV2 } from '@idriss-xyz/ui/progress-bar-v2';
import { IconButton } from '@idriss-xyz/ui/icon-button';

import { getTimeRemaining } from '@/app/creators/utils';
import { Goal } from '@/app/creators/utils/types';

/* TODO: Replace for hook and call to api */
const useGoals: () => Goal[] = () => {
  return [
    {
      id: '1',
      name: 'Help me upgrade to the secretlab titan chair',
      targetAmount: 500,
      progress: 320,
      startDate: '01/01/2025',
      endDate: '12/31/2025',
      topDonor: { name: 'geoist_', amount: 50 },
    },
    {
      id: '2',
      name: 'Get an elgato key light to brighten up my stream',
      targetAmount: 180,
      progress: 210,
      startDate: '01/01/2025',
      endDate: '11/15/2025',
      topDonor: { name: 'geoist_', amount: 50 },
    },
    {
      id: '3',
      name: 'New microphone',
      targetAmount: 320,
      progress: 320,
      startDate: '01/01/2025',
      endDate: '01/20/2026',
      topDonor: { name: 'geoist_', amount: 50 },
    },
    {
      id: '4',
      name: 'New graphics card',
      targetAmount: 430,
      progress: 30,
      startDate: '01/01/2025',
      endDate: '03/01/2025',
      topDonor: { name: 'geoist_', amount: 50 },
    },
  ];
};

// ts-unused-exports:disable-next-line
export default function GoalHistory() {
  const goals = useGoals();

  return (
    <div className="flex flex-wrap justify-start gap-4 px-4 py-2">
      {goals.map((goal) => {
        const progressPercentage = (goal.progress / goal.targetAmount) * 100;
        return (
          <Card
            key={goal.id}
            className="flex w-[366px] shrink-0 flex-col gap-12 shadow-none border"
          >
            {/* Header section*/}
            <div className="flex flex-col gap-6">
              <div className="flex min-h-14 w-full">
                <CardHeader className="grow text-label1">
                  {goal.name}
                </CardHeader>
                <div className="flex justify-end">
                  <IconButton
                    iconName="Trash2"
                    intent="tertiary"
                    size="small"
                    className="size-10 border"
                   />
                </div>
              </div>
              <div className="flex items-center justify-between text-label4">
                <span className="text-neutral-600">Start date</span>
                <span className="text-neutral-900">{goal.startDate}</span>
              </div>
              <div className="flex items-center justify-between text-label4">
                <span className="text-neutral-600">End date</span>
                <span className="text-neutral-900">{goal.endDate}</span>
              </div>
            </div>
            <CardBody className="flex flex-col gap-12 text-label4">
              {/* Progress section*/}
              <div className="flex flex-col gap-2">
                <div className="h-4 w-full">
                  <ProgressBarV2
                    progress={
                      progressPercentage <= 100 ? progressPercentage : 100
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-label4 text-neutral-600">Progress</span>
                  <span className="text-label3 text-black">
                    ${goal.progress}/${goal.targetAmount} (
                    {progressPercentage.toFixed(0)}%)
                  </span>
                </div>
                <Badge
                  type="success"
                  variant="subtle"
                  className="w-fit lowercase"
                >
                  {getTimeRemaining(goal.endDate)}
                </Badge>
              </div>
              {/* Top donor section*/}
              <div className="flex items-center gap-2">
                <Icon name="Users2" size={20} />
                <span className="text-neutral-600">Top donor:</span>
                <span className="text-neutral-900">
                  @{goal.topDonor.name} (${goal.topDonor.amount})
                </span>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
