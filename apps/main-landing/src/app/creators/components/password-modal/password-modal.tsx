'use client';

import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Divider } from '@idriss-xyz/ui/divider';
import { Input } from '@idriss-xyz/ui/input';
import { Modal } from '@idriss-xyz/ui/modal';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';

import { IDRISS_TOROID } from '@/assets';

import { useAuth } from '../../context/auth-context';

type Properties = {
  isOpened: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const PasswordModal = ({ isOpened, onClose, onSuccess }: Properties) => {
  const { setEarlyAccessToken } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${CREATOR_API_URL}/auth/early-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        setEarlyAccessToken(token);
        onSuccess();
      } else {
        setError('Invalid code. Check it and try again.');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      className="flex w-[500px] flex-col items-center justify-center gap-y-6 rounded-xl border border-black/20 bg-white p-6 text-center"
      isOpened={isOpened}
      onClose={onClose}
      closeOnClickAway
    >
      <div className="flex w-full flex-col items-center justify-center pb-4">
        <Image
          src={IDRISS_TOROID.src}
          alt="Early access modal image"
          width={156}
          height={156}
          className="my-3"
        />
        <h1 className="text-heading3 text-neutral-900">
          Welcome to v2 early access
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-6"
      >
        <div className="w-full">
          <div className="flex w-full items-start gap-2">
            <div className="grow">
              <Input
                placeholder="Enter invite code"
                value={password}
                onChange={(inputEvent) => {
                  return setPassword(inputEvent.target.value);
                }}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <Button
              size="medium"
              className="uppercase"
              intent="secondary"
              aria-label="Continue"
              type="submit"
              suffixIconName="IdrissArrowRight"
              disabled={isLoading}
            >
              Continue
            </Button>
          </div>
          {error && (
            <span className="flex items-center space-x-1 pt-1 text-label7 text-red-500 lg:text-label7">
              <Icon name="AlertCircle" size={12} className="p-0.5" />
              {error}
            </span>
          )}
        </div>
        <Divider />
      </form>
    </Modal>
  );
};
