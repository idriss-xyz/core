'use client';

import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { Badge } from '@idriss-xyz/ui/badge';
import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { formatFiatValue } from '@idriss-xyz/utils';
import { useState } from 'react';
import { getAccessToken } from '@privy-io/react-auth';

import { ConfirmationModal } from '@/app/components/confirmation-modal';
import {
  activateDonationGoal,
  deleteDonationGoal,
} from '@/app/utils/donation-goals';
import { useDonationGoals } from '@/app/context/donation-goals-context';
import { getTimeRemaining } from '@/app/utils';

const handleActivateGoal = async (goalId: number) => {
  const authToken = await getAccessToken();
  if (!authToken) {
    console.error('No auth token found');
    return;
  }
  await activateDonationGoal(goalId, authToken);
};

interface NoGoalsProperties {
  setIsNewGoalFormOpenAction: (isOpen: boolean) => void;
}

const NoGoals = ({ setIsNewGoalFormOpenAction }: NoGoalsProperties) => {
  return (
    <div className="mx-auto flex min-h-[548px] w-[477px] flex-col items-center justify-center gap-4">
      <span className="text-center text-heading6 uppercase text-neutral-900">
        No goals yet
      </span>
      <span className="mx-8 text-center text-display5 uppercase gradient-text">
        Start something <br />
        your fans can support
      </span>
      <Button
        intent="primary"
        size="medium"
        onClick={() => {
          return setIsNewGoalFormOpenAction(true);
        }}
        suffixIconName="Plus"
      >
        Create new goal
      </Button>
    </div>
  );
};

interface GoalListProperties {
  setIsNewGoalFormOpenAction: (isOpen: boolean) => void;
}

export function GoalsList({ setIsNewGoalFormOpenAction }: GoalListProperties) {
  const { activeGoal, inactiveGoals, refetch } = useDonationGoals();
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<number | null>(null);

  const handleDeleteGoal = async (goalId: number) => {
    const authToken = await getAccessToken();
    if (!authToken) {
      console.error('No auth token found');
      return;
    }
    await deleteDonationGoal(goalId, authToken);
    await refetch();
  };

  return inactiveGoals && inactiveGoals.length > 0 ? (
    <>
      <div className="flex items-center gap-3">
        <h5 className="text-heading5 text-neutralGreen-900">Goals list</h5>
        <Button
          intent="primary"
          size="medium"
          onClick={() => {
            return setIsNewGoalFormOpenAction(true);
          }}
          suffixIconName="Plus"
        >
          Create new goal
        </Button>
      </div>
      <div className="flex flex-wrap justify-start gap-4">
        {inactiveGoals?.map((goal) => {
          {
            /* Goal variables */
          }
          const cappedProgress =
            goal.progress >= goal.targetAmount
              ? goal.targetAmount
              : goal.progress;
          const progressPercentage = (cappedProgress / goal.targetAmount) * 100;
          // const isExpired = new Date(goal.endDate) > new Date();
          const isExpired = getTimeRemaining(goal.endDate) === 'Expired';

          {
            /* Goal jsx */
          }
          return (
            <Card
              key={goal.id}
              className="flex w-full flex-col gap-2 border p-4 shadow-none"
            >
              {/* Header section*/}
              <div className="flex h-10 items-center justify-between">
                <CardHeader className="flex items-center gap-[6px] text-label2">
                  <Icon name="Goal" size={20} />
                  <span className="text-label2">{goal.name}</span>
                  {isExpired && (
                    <Badge
                      type="info"
                      variant="subtle"
                      className="w-fit capitalize"
                    >
                      Expired
                    </Badge>
                  )}
                </CardHeader>
                <span className="text-label3 text-black">
                  {formatFiatValue(Number(cappedProgress))}
                  /${goal.targetAmount} ({progressPercentage.toFixed(0)}%)
                </span>
              </div>
              {/* Body section */}
              <CardBody className="flex justify-between">
                <div className="flex items-center gap-6 text-label4">
                  <div className="flex gap-2">
                    <span className="text-neutral-600">Target amount</span>
                    <span className="text-neutral-900">
                      ${goal.targetAmount}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-neutral-600">Start date</span>
                    <span className="text-neutral-900">
                      {new Date(Number(goal.startDate)).toLocaleDateString(
                        'en-GB',
                      )}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-neutral-600">End date</span>
                    <span className="text-neutral-900">
                      {new Date(Number(goal.endDate)).toLocaleDateString(
                        'en-GB',
                      )}
                    </span>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <IconButton
                    iconName="Trash2"
                    intent="tertiary"
                    size="small"
                    className="size-10 border"
                    onClick={() => {
                      setGoalToDelete(goal.id);
                      return setIsRemoveModalOpen(true);
                    }}
                  />
                  {!isExpired && (
                    <Button
                      intent="secondary"
                      size="medium"
                      className="py-auto h-11 px-6 uppercase"
                      onClick={async () => {
                        await handleActivateGoal(goal.id);
                        await refetch();
                      }}
                    >
                      Activate
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
      <ConfirmationModal
        isOpened={isRemoveModalOpen}
        onClose={() => {
          setIsRemoveModalOpen(false);
          setGoalToDelete(null);
        }}
        onConfirm={async () => {
          if (goalToDelete) {
            await handleDeleteGoal(goalToDelete);
          }
          setIsRemoveModalOpen(false);
          setGoalToDelete(null);
        }}
        title="Remove this goal?"
        sectionSubtitle="Removing this goal will permanently delete it from your list. Once removed, you won’t be able to bring it back or make it active again in the future."
        confirmButtonText="REMOVE"
        confirmButtonIntent="secondary"
      />
    </>
  ) : inactiveGoals?.length == 0 && !activeGoal ? (
    <NoGoals setIsNewGoalFormOpenAction={setIsNewGoalFormOpenAction} />
  ) : inactiveGoals?.length == 0 && activeGoal ? (
    <div className="flex items-center gap-3">
      <h5 className="text-heading5 text-neutralGreen-900">Goals list</h5>
      <Button
        intent="primary"
        size="medium"
        onClick={() => {
          return setIsNewGoalFormOpenAction(true);
        }}
        suffixIconName="Plus"
      >
        Create new goal
      </Button>
    </div>
  ) : (
    <></>
  );
}
