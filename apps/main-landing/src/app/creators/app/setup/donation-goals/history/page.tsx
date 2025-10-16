'use client';

import { Badge } from '@idriss-xyz/ui/badge';
import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { Icon } from '@idriss-xyz/ui/icon';
import { ProgressBarV2 } from '@idriss-xyz/ui/progress-bar-v2';

import { getTimeRemaining } from '@/app/creators/utils';

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  progress: number;
  startDate: string;
  endDate: string;
  topDonor: string;
  topDonorAmount: number;
};

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
      topDonor: 'geoist_',
      topDonorAmount: 50,
    },
    {
      id: '2',
      name: 'Get an elgato key light to brighten up my stream',
      targetAmount: 500,
      progress: 320,
      startDate: '01/01/2025',
      endDate: '11/15/2025',
      topDonor: 'geoist_',
      topDonorAmount: 50,
    },
    {
      id: '3',
      name: 'New microphone',
      targetAmount: 320,
      progress: 320,
      startDate: '01/01/2025',
      endDate: '01/20/2026',
      topDonor: 'geoist_',
      topDonorAmount: 50,
    },
    {
      id: '4',
      name: 'New graphics card',
      targetAmount: 430,
      progress: 30,
      startDate: '01/01/2025',
      endDate: '03/01/2025',
      topDonor: 'geoist_',
      topDonorAmount: 50,
    },
  ];
};

// ts-unused-exports:disable-next-line
export default function GoalHistory() {
  const goals = useGoals();

  return (
    <div className="flex flex-wrap justify-start gap-4 px-4 py-2">
      {goals.map((goal) => {
        return (
          <Card
            key={goal.id}
            className="flex w-[366px] shrink-0 flex-col gap-12"
          >
            {/* Header section*/}
            <div className="flex flex-col gap-6">
              <CardHeader className="min-h-14 text-label1">
                {goal.name}
              </CardHeader>
              <div className="flex items-center justify-between text-label4">
                <span className="text-neutral-600">Start date</span>
                <span>{goal.startDate}</span>
              </div>
              <div className="flex items-center justify-between text-label4">
                <span className="text-neutral-600">End date</span>
                <span>{goal.endDate}</span>
              </div>
            </div>
            <CardBody className="flex flex-col gap-12 text-label4">
              {/* Progress section*/}
              <div className="flex flex-col gap-2">
                <div className="h-4 w-full">
                  <ProgressBarV2
                    progress={(goal.progress / goal.targetAmount) * 100}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-label4 text-neutral-600">Progress</span>
                  <span className="text-label3 text-neutral-900">
                    ${goal.progress}/ ${goal.targetAmount} (
                    {((goal.progress / goal.targetAmount) * 100).toFixed(2)}%)
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
                  @{goal.topDonor} (${goal.topDonorAmount})
                </span>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
