'use client';
import { useState } from 'react';
import { Modal } from '@idriss-xyz/ui/modal';
import { Button } from '@idriss-xyz/ui/button';
import {
  IdrissCardRadioGroup,
  CardRadioItem,
} from '@idriss-xyz/ui/radio-group';

import { ACCOUNT_CARD, GUEST_CARD } from '@/assets';

export const DonateOptionsModal = () => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const cardRadioItems: CardRadioItem[] = [
    {
      value: 'guest',
      title: 'Donate as a guest',
      description: 'Quick and anonymous donation without creating an account',
      image: GUEST_CARD.src,
      imageAlt: 'Guest donation',
    },
    {
      value: 'account',
      title: 'Get recognized',
      description: 'Create an account to track donations and get recognition',
      image: ACCOUNT_CARD.src,
      imageAlt: 'Account donation',
    },
  ];

  const handleSaveChoice = () => {
    if (selectedOption) {
      localStorage.setItem('donateOptionChosen', selectedOption);
    }
  };

  return (
    <Modal isOpened onClose={() => {}}>
      <div className="mx-auto w-[752px] p-6">
        <h3 className="mb-6 text-center text-heading3 font-semibold">
          How would you like to donate?
        </h3>

        <div className="mb-6">
          <IdrissCardRadioGroup
            items={cardRadioItems}
            value={selectedOption}
            onChange={setSelectedOption}
          />
        </div>

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
    </Modal>
  );
};
