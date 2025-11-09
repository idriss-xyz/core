'use client';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '@idriss-xyz/ui/card';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { Controller, useForm } from 'react-hook-form';
import { Toggle } from '@idriss-xyz/ui/toggle';
import { getAccessToken } from '@privy-io/react-auth';

import { editCreatorProfile } from '@/app/utils';
import { useAuth } from '@/app/context/auth-context';
import { ConfirmationModal } from '@/app/components/confirmation-modal/confirmation-modal';
import { CopyInput } from '@/app/components/copy-input/copy-input';

import { GoalsList } from './goals-list';
import { NewGoalForm } from './components/new-goal-form';
import ActiveGoal from './active-goal';

// ts-unused-exports:disable-next-line
export default function DonationGoalsPage() {
  const { creator, setCreator } = useAuth();
  const queryClient = useQueryClient();

  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isNewGoalFormOpen, setIsNewGoalFormOpen] = useState(false);
  const [isUrlWarningConfirmed, setIsUrlWarningConfirmed] = useState(false);
  const [confirmButtonText, setConfirmButtonText] = useState('Copy link');
  const [wasCopied, setWasCopied] = useState(false);

  type FormPayload = { displayTopDonor: boolean };

  const formMethods = useForm<FormPayload>({
    defaultValues: { displayTopDonor: creator?.displayTopDonor ?? true },
  });

  useEffect(() => {
    if (creator) {
      formMethods.reset({ displayTopDonor: creator.displayTopDonor ?? true });
    }
  }, [creator, formMethods]);

  const openConfirmationModal = (source: 'text' | 'icon') => {
    if (source === 'icon') {
      setConfirmButtonText('COPY LINK');
    } else {
      setConfirmButtonText('GOT IT');
    }
    setIsCopyModalOpen(true);
  };

  const onSubmitToggles = async ({ displayTopDonor }: FormPayload) => {
    try {
      const authToken = await getAccessToken();
      if (!authToken || !creator?.name) return;

      await editCreatorProfile(creator.name, { displayTopDonor }, authToken);

      setCreator((previous) => {
        return previous ? { ...previous, displayTopDonor } : previous;
      });
    } catch (error) {
      console.error('Error saving displayTopDonor:', error);
    }
  };

  return (
    <Card className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-6">
        <h5 className="text-heading5 text-neutralGreen-900">Goals</h5>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <label
                className={classes('pb-1 text-label4 text-neutralGreen-700')}
              >
                Goal overlay link
              </label>
              <CopyInput
                value={`${creator?.goalUrl ?? ''}`}
                wasCopied={wasCopied}
                onIconClick={
                  isUrlWarningConfirmed
                    ? () => {
                        if (creator?.goalUrl) {
                          void navigator.clipboard.writeText(creator.goalUrl);
                          setWasCopied(true);
                          setTimeout(() => {
                            return setWasCopied(false);
                          }, 2000);
                        }
                      }
                    : () => {
                        return openConfirmationModal('icon');
                      }
                }
                onTextClick={
                  isUrlWarningConfirmed
                    ? () => {}
                    : () => {
                        return openConfirmationModal('text');
                      }
                }
              />
              <div className="flex items-center pt-1">
                <span
                  className={classes(
                    'flex items-center space-x-1 text-label7 text-neutral-600 lg:text-label7',
                  )}
                >
                  Add this as a browser source in your streaming software
                </span>
                <Icon
                  name="HelpCircle"
                  size={16}
                  className="p-0.5 text-neutral-600"
                />
              </div>
              <Controller
                name="displayTopDonor"
                control={formMethods.control}
                render={({ field }) => {
                  return (
                    <Toggle
                      label="Show top donor"
                      sublabel="Displays the current top donor on your goal overlay"
                      value={field.value}
                      onChange={(v) => {
                        field.onChange(v);
                        setTimeout(() => {
                          void formMethods.handleSubmit(onSubmitToggles)();
                        }, 0);
                      }}
                      className="w-fit pt-3"
                    />
                  );
                }}
              />
            </div>
          </div>
          <hr />

          {isNewGoalFormOpen && (
            <NewGoalForm
              onGoalCreated={() => {
                void queryClient.invalidateQueries({
                  queryKey: ['donation-goals', creator?.name],
                });
                setIsNewGoalFormOpen(false);
              }}
              onClose={() => {
                return setIsNewGoalFormOpen(false);
              }}
            />
          )}
        </div>
      </div>

      <ActiveGoal />

      <GoalsList
        setIsNewGoalFormOpenAction={setIsNewGoalFormOpen}
        isNewGoalFormOpen={isNewGoalFormOpen}
      />

      <ConfirmationModal
        isOpened={isCopyModalOpen}
        onClose={() => {
          setIsCopyModalOpen(false);
          setIsUrlWarningConfirmed(true);
        }}
        onConfirm={() => {
          if (confirmButtonText === 'COPY LINK' && creator?.goalUrl) {
            void navigator.clipboard.writeText(creator.goalUrl);
            setWasCopied(true);
            setTimeout(() => {
              return setWasCopied(false);
            }, 2000);
          }
        }}
        title="Confirm before copying"
        sectionSubtitle="Anyone with this link can embed your donation goal on their own stream or website.
          Do not share it with anyone or show it on stream."
        confirmButtonText={confirmButtonText}
        confirmButtonIntent="secondary"
      />
    </Card>
  );
}
