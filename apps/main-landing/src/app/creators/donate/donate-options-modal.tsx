'use client';
import { useState } from 'react';
import { Modal } from '@idriss-xyz/ui/modal';
import { Card, CardHeader, CardBody } from '@idriss-xyz/ui/card';
import { Button } from '@idriss-xyz/ui/button';
import { Checkbox } from '@idriss-xyz/ui/checkbox';

import { ACCOUNT_CARD, GUEST_CARD } from '@/assets';

export const DonateOptionsModal = () => {
  const [selectedOption, setSelectedOption] = useState<
    'guest' | 'account' | null
  >(null);

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

        <div className="mb-6 grid grid-cols-2 gap-4">
          {/* Guest Card */}
          <Card
            className={`cursor-pointer p-0 shadow-none transition-all ${selectedOption === 'guest' ? 'border-[1.5px] border-mint-400' : 'border border-gray-200'}`}
          >
            <div className="p-1">
              <img
                src={GUEST_CARD.src}
                alt="Guest card"
                className="h-[200px] w-full rounded-lg bg-neutral-100 object-cover"
              />
            </div>
            <div className="flex flex-col gap-1 p-4">
              <div className="flex items-center justify-between">
                <CardHeader className="text-heading4">
                  Donate as a guest
                </CardHeader>
                <Checkbox
                  value={selectedOption === 'guest'}
                  onChange={() => {
                    return setSelectedOption(
                      selectedOption === 'guest' ? null : 'guest',
                    );
                  }}
                />
              </div>
              <CardBody>
                <p className="text-body2 text-neutral-600">
                  Support quietly without logging in and creating a public
                  profile.
                </p>
              </CardBody>
            </div>
          </Card>

          {/* Account Card */}
          <Card
            className={`cursor-pointer p-0 shadow-none transition-all ${selectedOption === 'account' ? 'border-[1.5px] border-mint-400' : 'border border-gray-200'}`}
          >
            <div className="p-1">
              <img
                src={ACCOUNT_CARD.src}
                alt="Account card"
                className="h-[200px] w-full rounded-lg bg-gradient-to-t object-cover"
              />
            </div>
            <div className="flex flex-col gap-1 p-4">
              <div className="flex items-center justify-between">
                <CardHeader className="text-heading4">
                  Get recognized
                </CardHeader>
                <Checkbox
                  value={selectedOption === 'account'}
                  onChange={() => {
                    return setSelectedOption(
                      selectedOption === 'account' ? null : 'account',
                    );
                  }}
                />
              </div>
              <CardBody>
                <p className="text-body2 text-neutral-600">
                  Personalized donation with custom message
                </p>
              </CardBody>
            </div>
          </Card>
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
