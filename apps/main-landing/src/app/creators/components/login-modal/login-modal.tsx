import {
  CREATOR_API_URL,
  PRIVACY_POLICY_LINK,
  TERMS_OF_SERVICE_LINK,
} from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { Modal } from '@idriss-xyz/ui/modal';
import { Divider } from '@idriss-xyz/ui/divider';
import Image from 'next/image';

import { IDRISS_TOROID } from '@/assets';

type Properties = {
  isOpened: boolean;
  onClose: () => void;
};

const handleTwitchLogin = () => {
  window.location.href = `${CREATOR_API_URL}/auth/twitch`;
};

export const LoginModal = ({ isOpened, onClose }: Properties) => {
  return (
    <Modal
      className="flex min-h-[420px] w-[500px] flex-col items-center justify-center gap-y-6 rounded-xl border border-black/20 bg-white p-6 text-center"
      isOpened={isOpened}
      onClose={onClose}
      closeOnClickAway
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
        >
          Continue with Twitch
        </Button>
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
            Privacy Policy
          </ExternalLink>
          .
        </span>
        <Divider />
      </div>
    </Modal>
  );
};
