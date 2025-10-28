'use client';

import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useState } from 'react';
import { getAccessToken } from '@privy-io/react-auth';

import { ConfirmationModal } from '@/app/creators/components/confirmation-modal';
import {
  activateDonationGoal,
  deleteDonationGoal,
} from '@/app/creators/utils/donation-goals';

import { useDonationGoals } from './context/donation-goals-context';

const handleActivateGoal = async (goalId: number) => {
  const authToken = await getAccessToken();
  if (!authToken) {
    console.error('No auth token found');
    return;
  }
  await activateDonationGoal(goalId, authToken);
};

interface NoGoalsProperties {
  setIsNewGoalFormOpen: (isOpen: boolean) => void;
}

const NoGoals = ({ setIsNewGoalFormOpen }: NoGoalsProperties) => {
  return (
    <div className="mx-auto flex min-h-[548px] w-[477px] flex-col items-center justify-center gap-4">
      <span className="text-center text-heading6 uppercase text-neutral-900">
        No goals yet
      </span>
      <span className="mx-8 text-center text-display5 uppercase gradient-text">
        Start something your fans can support
      </span>
      <Button
        intent="primary"
        size="medium"
        onClick={() => {
          return setIsNewGoalFormOpen(true);
        }}
        suffixIconName="Plus"
      >
        Create new goal
      </Button>
    </div>
  );
};

interface GoalListProperties {
  setIsNewGoalFormOpen: (isOpen: boolean) => void;
}

export function GoalsList({ setIsNewGoalFormOpen }: GoalListProperties) {
  const { activeGoal, inactiveGoals, refetch } = useDonationGoals();
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<number | null>(null);
  console.log('activeGoal', activeGoal);
  console.log('inactiveGoals', inactiveGoals);

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
            return setIsNewGoalFormOpen(true);
          }}
          suffixIconName="Plus"
        >
          Create new goal
        </Button>
      </div>
      <div className="flex flex-wrap justify-start gap-4">
        {inactiveGoals?.map((goal) => {
          const progressPercentage = (goal.progress / goal.targetAmount) * 100;
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
                </CardHeader>
                <span className="text-label3 text-black">
                  ${goal.progress}/${goal.targetAmount} (
                  {progressPercentage.toFixed(0)}%)
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
        title="Confirm before removing"
        sectionSubtitle="You are removing one of your donation goals, which means incoming donations won't add to this goal anymore. This action cannot be undone."
        confirmButtonText="REMOVE"
        confirmButtonIntent="secondary"
      />
    </>
  ) : inactiveGoals?.length == 0 && !activeGoal ? (
    <NoGoals setIsNewGoalFormOpen={setIsNewGoalFormOpen} />
  ) : (
    <></>
  );
}
