'use client';

import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useMemo, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

import { ConfirmationModal } from '@/app/creators/components/confirmation-modal';
import { useAuth } from '@/app/creators/context/auth-context';
import { useGetDonationGoals } from '@/app/creators/app/commands/get-donation-goals';

export function GoalsList() {
  const { creator } = useAuth();
  const { ready, authenticated } = usePrivy();
  const goalListQuery = useGetDonationGoals(creator?.name, {
    enabled: ready && authenticated && !!creator?.name,
  });
  const allGoals = useMemo(() => {
    return goalListQuery.data ?? [];
  }, [goalListQuery.data]);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  
  const handleActivateGoal = () => {
    // Implement activation logic here
  };

  return (
    <>
      <h5 className="text-heading5 text-neutralGreen-900">Goals list</h5>
      <div className="flex flex-wrap justify-start gap-4">
        {allGoals.map((goal) => {
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
                      return setIsRemoveModalOpen(true);
                    }}
                  />
                  <Button
                    intent="secondary"
                    size="medium"
                    className="py-auto h-11 px-6 uppercase"
                    onClick={handleActivateGoal}
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
        }}
        onConfirm={() => {
          console.log('Delete'); //TODO: Call api and delete
        }}
        title="Confirm before removing"
        sectionSubtitle="You are removing one of your donation goals, which means incoming donations won't add to this goal anymore. This action cannot be undone."
        confirmButtonText="REMOVE"
        confirmButtonIntent="secondary"
      />
    </>
  );
}
