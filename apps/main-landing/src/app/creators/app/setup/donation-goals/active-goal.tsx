import { Badge } from '@idriss-xyz/ui/badge';
import { Card, CardBody } from '@idriss-xyz/ui/card';
import { Icon } from '@idriss-xyz/ui/icon';
import { ProgressBarV2 } from '@idriss-xyz/ui/progress-bar-v2';

import { getTimeRemaining } from '@/app/creators/utils';

export default function ActiveGoal() {
  const goal = {
    id: '1',
    title: 'Goal Title',
    description: 'Goal Description',
    progress: 500,
    targetAmount: 1000,
    startDate: '17732107239',
    endDate: '17732107239',
    topDonor: {
      name: 'John Doe',
      amount: 50,
    },
  };

  const progressPercentage = (goal.progress / goal.targetAmount) * 100;

  return (
    <Card className="flex flex-col gap-12 text-label4">
      {/* Progress section*/}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-full">
          <ProgressBarV2
            progress={progressPercentage <= 100 ? progressPercentage : 100}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-label4 text-neutral-600">Progress</span>
          <span className="text-label4 text-neutral-900">
            {progressPercentage}%
          </span>
        </div>
      </div>
      {/* Goal details section*/}
      <CardBody className="flex flex-col gap-12 text-label4">
        {/* Progress section*/}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-label4 text-neutral-600">Progress</span>
            <span className="text-label3 text-black">
              ${goal.progress}/${goal.targetAmount} (
              {progressPercentage.toFixed(0)}%)
            </span>
          </div>
          <Badge type="success" variant="subtle" className="w-fit lowercase">
            {getTimeRemaining(Number(goal.endDate))}
          </Badge>
        </div>
        {/* Top donor section*/}
        <div className="flex items-center gap-2">
          <Icon name="Users2" size={20} />
          <span className="text-neutral-600">Top donor:</span>
          <span className="text-neutral-900">
            {goal.topDonor.name} (${goal.topDonor.amount})
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
