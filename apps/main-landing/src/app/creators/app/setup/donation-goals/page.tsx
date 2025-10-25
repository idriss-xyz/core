'use client';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '@idriss-xyz/ui/card';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';

import { useAuth } from '@/app/creators/context/auth-context';
import { ConfirmationModal } from '@/app/creators/components/confirmation-modal/confirmation-modal';
import { CopyInput } from '@/app/creators/components/copy-input/copy-input';

import { GoalsList } from './goals-list';
import { NewGoalForm } from './components/new-goal-form';
import ActiveGoal from './active-goal';

// ts-unused-exports:disable-next-line
export default function DonationGoalsPage() {
  const { creator } = useAuth();
  const queryClient = useQueryClient();

  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isUrlWarningConfirmed, setIsUrlWarningConfirmed] = useState(false);
  const [confirmButtonText, setConfirmButtonText] = useState('Copy link');
  const [wasCopied, setWasCopied] = useState(false);

  const openConfirmationModal = (source: 'text' | 'icon') => {
    if (source === 'icon') {
      setConfirmButtonText('COPY LINK');
    } else {
      setConfirmButtonText('GOT IT');
    }
    setIsCopyModalOpen(true);
  };

  return (
    <Card className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-6">
        <h5 className="text-heading5 text-neutralGreen-900">Donation goals</h5>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <label
                className={classes('pb-1 text-label4 text-neutralGreen-700')}
              >
                Goal overlay link
              </label>
              {/* TODO: Replace for donation goal overlay link*/}
              <CopyInput
                value={`${creator?.obsUrl ?? ''}`}
                wasCopied={wasCopied}
                onIconClick={
                  isUrlWarningConfirmed
                    ? () => {
                        if (creator?.obsUrl) {
                          void navigator.clipboard.writeText(creator.obsUrl);
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
                  Copy this permanent link to show your goal on stream.
                </span>
                <Icon
                  name="HelpCircle"
                  size={16}
                  className="p-0.5 text-neutral-600"
                />
              </div>
            </div>
          </div>
          <hr />

          <NewGoalForm
            onGoalCreated={() => {
              void queryClient.invalidateQueries({
                queryKey: ['donation-goals', creator?.name],
              });
            }}
          />
        </div>
      </div>

      <ActiveGoal />

      <GoalsList />

      <ConfirmationModal
        isOpened={isCopyModalOpen}
        onClose={() => {
          setIsCopyModalOpen(false);
          setIsUrlWarningConfirmed(true);
        }}
        onConfirm={() => {
          {
            /* TODO: Replace for donation goal overlay link (add property on backend)*/
          }
          if (confirmButtonText === 'COPY LINK' && creator?.obsUrl) {
            void navigator.clipboard.writeText(creator.obsUrl);
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
