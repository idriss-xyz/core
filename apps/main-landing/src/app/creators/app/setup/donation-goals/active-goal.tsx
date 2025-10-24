import { Badge } from '@idriss-xyz/ui/badge';
import { Button } from '@idriss-xyz/ui/button';
import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { Icon } from '@idriss-xyz/ui/icon';
import { ProgressBarV2 } from '@idriss-xyz/ui/progress-bar-v2';

import { getTimeRemaining } from '@/app/creators/utils';

export default function ActiveGoal() {
  const goal = {
    id: '1',
    name: 'Goal Title',
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
    <>
      <h5 className="text-heading5 text-neutralGreen-900">Active goal</h5>
      <Card className="flex flex-col gap-4 border p-4 text-label4 shadow-none">
        {/* Header section*/}
        <div className="flex items-center justify-between">
          <CardHeader className="flex items-center gap-[6px] text-label2">
            <Icon name="Goal" size={20} />
            <span className="text-label2">{goal.name}</span>
          </CardHeader>
          <div className="flex gap-2">
            <span className="text-neutral-600">End date</span>
            <span className="text-neutral-900">
              {new Date(Number(goal.endDate)).toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>
        {/* Goal details*/}
        <CardBody className="flex flex-col gap-4 text-label4">
          {/* Progress section*/}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full">
              <ProgressBarV2
                progress={progressPercentage <= 100 ? progressPercentage : 100}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-label3 text-black">
                ${goal.progress}/${goal.targetAmount} (
                {progressPercentage.toFixed(0)}%)
              </span>
              <Badge
                type="success"
                variant="subtle"
                className="w-fit lowercase"
              >
                {getTimeRemaining(Number(goal.endDate))}
              </Badge>
            </div>
          </div>
          {/* Top donor section*/}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Users2" size={20} />
              <span className="text-neutral-600">Top donor:</span>
              <span className="text-neutral-900">
                {goal.topDonor.name} (${goal.topDonor.amount})
              </span>
            </div>
            <Button
              className="h-11 px-6 uppercase"
              intent="secondary"
              size="medium"
            >
              End goal
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
