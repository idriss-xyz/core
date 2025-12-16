'use client';
import {
  CREATOR_API_URL,
  PRIVACY_POLICY_LINK,
  TERMS_OF_SERVICE_LINK,
} from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { Modal } from '@idriss-xyz/ui/modal';
import Image from 'next/image';
import { useCallback } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';

import { IDRISS_TOROID } from '@/assets';

import { useAuth } from '../../context/auth-context';

export const LoginModal = () => {
  const {
    setOauthLoading,
    loading,
    error,
    isLoginModalOpen,
    setIsModalOpen,
    setIsLoading,
  } = useAuth();

  const handleTwitchLogin = useCallback(() => {
    setIsLoading(true);
    setOauthLoading(true);
    window.location.href = `${CREATOR_API_URL}/auth/twitch`;
  }, [setOauthLoading, setIsLoading]);

  return (
    <Modal
      // z-[2147483647] is used to hide privy login modal behind our own (in case css rules fail)
      className="z-[2147483647] flex min-h-[420px] w-[500px] flex-col items-center justify-center gap-y-6 rounded-xl border border-black/20 bg-white p-6 text-center"
      isOpened={isLoginModalOpen}
      onClose={() => {
        return setIsModalOpen(false);
      }}
      closeOnClickAway
      withoutPortal
    >
      <div className="flex w-full flex-col items-center justify-center pb-4">
        <Image
          src={IDRISS_TOROID.src}
          alt="Login modal image"
          width={156}
          height={156}
          className="my-3"
        />
        <h1 className="text-heading3 text-neutral-900">Log in or sign up</h1>
      </div>
      <div className="flex w-full flex-col items-center gap-6">
        <Button
          size="large"
          className="w-full uppercase"
          intent="secondary"
          aria-label="Login with Twitch"
          prefixIconName="TwitchOutlinedBold"
          onClick={handleTwitchLogin}
          loading={loading}
        >
          Continue with Twitch
        </Button>
        {error && (
          <div className="flex items-start gap-x-1 text-label7 text-red-500 lg:text-label6">
            <Icon name="AlertCircle" size={16} className="p-px" />
            <span>Something went wrong. Try again.</span>
          </div>
        )}
        <span className="w-full text-label5 text-neutral-500">
          By logging in, you agree to our
          <br />
          <ExternalLink
            className="text-mint-600 underline"
            href={TERMS_OF_SERVICE_LINK}
          >
            Terms of service
          </ExternalLink>{' '}
          &{' '}
          <ExternalLink
            className="text-mint-600 underline"
            href={PRIVACY_POLICY_LINK}
          >
            Privacy policy
          </ExternalLink>
          .
        </span>
      </div>
    </Modal>
  );
};
