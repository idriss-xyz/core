'use client';

import { Badge } from '@idriss-xyz/ui/badge';
import { Card, CardBody, CardHeader } from '@idriss-xyz/ui/card';
import { Icon } from '@idriss-xyz/ui/icon';
import { ProgressBarV2 } from '@idriss-xyz/ui/progress-bar-v2';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useMemo, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

import { getTimeRemaining } from '@/app/creators/utils';
import { ConfirmationModal } from '@/app/creators/components/confirmation-modal';
import { useAuth } from '@/app/creators/context/auth-context';
import { useGetDonationGoals } from '@/app/creators/app/commands/get-donation-goals';

// ts-unused-exports:disable-next-line
export default function GoalHistory() {
  const { creator } = useAuth();
  const { ready, authenticated } = usePrivy();
  const tipHistoryQuery = useGetDonationGoals(creator?.name, {
    enabled: ready && authenticated && !!creator?.name,
  });
  const allGoals = useMemo(() => {
    return tipHistoryQuery.data ?? [];
  }, [tipHistoryQuery.data]);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap justify-start gap-4 px-4 py-2">
        {allGoals.map((goal) => {
          const progressPercentage = (goal.progress / goal.targetAmount) * 100;
          return (
            <Card
              key={goal.id}
              className="flex w-[366px] shrink-0 flex-col gap-12 border shadow-none"
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
                      onClick={() => {
                        return setIsRemoveModalOpen(true);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-label4">
                  <span className="text-neutral-600">Start date</span>
                  <span className="text-neutral-900">
                    {new Date(Number(goal.startDate)).toLocaleDateString(
                      'en-GB',
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-label4">
                  <span className="text-neutral-600">End date</span>
                  <span className="text-neutral-900">
                    {new Date(Number(goal.endDate)).toLocaleDateString('en-GB')}
                  </span>
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
                    <span className="text-label4 text-neutral-600">
                      Progress
                    </span>
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
