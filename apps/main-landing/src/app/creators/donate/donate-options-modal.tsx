'use client';
import { useState } from 'react';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { Modal } from '@idriss-xyz/ui/modal';
import { Button } from '@idriss-xyz/ui/button';
import {
  IdrissCardRadioGroup,
  CardRadioItem,
} from '@idriss-xyz/ui/radio-group';
import { usePrivy } from '@privy-io/react-auth';

import { ACCOUNT_CARD, GUEST_CARD } from '@/assets';

import { useAuth } from '../context/auth-context';

const cardRadioItems: CardRadioItem[] = [
  {
    value: 'guest',
    title: 'Donate as a guest',
    description:
      'Support quietly without logging in and creating a public profile.',
    image: GUEST_CARD.src,
    imageAlt: 'Guest donation',
  },
  {
    value: 'account',
    title: 'Get recognized',
    description:
      'Join the leaderboard, earn status, and track impact with a profile.',
    image: ACCOUNT_CARD.src,
    imageAlt: 'Account donation',
  },
];

export const DonateOptionsModal = () => {
  const [selectedOption, setSelectedOption] = useState<string>('account');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const { authenticated } = usePrivy();
  const { donor } = useAuth();

  const modalOpen = isModalOpen && !(authenticated && donor);

  const handleSaveChoice = () => {
    switch (selectedOption) {
      case 'guest': {
        setIsModalOpen(false);
        break;
      }
      case 'account': {
        // Redirect to Twitch auth with callback parameter
        const currentPath = window.location.pathname;
        const callbackParameter = currentPath.startsWith('/creators/')
          ? currentPath.slice(1)
          : 'creators'; // Remove leading slash
        window.location.href = `${CREATOR_API_URL}/auth/twitch?callback=${encodeURIComponent(callbackParameter)}`;
        setIsModalOpen(false);
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <Modal
      isOpened={modalOpen}
      onClose={() => {
        return setIsModalOpen(false);
      }}
    >
      <div className="mx-auto flex w-[360px] flex-col gap-8 p-6 lg:w-[752px]">
        <h3 className="text-center text-heading4 text-neutral-900 lg:text-heading3">
          How would you like to donate?
        </h3>

        <div className="flex flex-col gap-6">
          <IdrissCardRadioGroup
            items={cardRadioItems}
            value={selectedOption}
            onChange={setSelectedOption}
          />
          <div className="flex justify-center">
            <Button
              onClick={handleSaveChoice}
              disabled={!selectedOption}
              intent="primary"
              size="medium"
              prefixIconName="Coins"
            >
              Donate
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
