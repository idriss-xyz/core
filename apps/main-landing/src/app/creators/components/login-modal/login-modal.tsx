import {
  CREATOR_API_URL,
  TOKEN_TERMS_AND_CONDITIONS_LINK,
} from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Link } from '@idriss-xyz/ui/link';
import { Modal } from '@idriss-xyz/ui/modal';

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
      className="flex min-h-[300px] w-[400px] flex-col justify-center gap-y-3 rounded-lg border border-black/20 bg-white p-5"
      isOpened={isOpened}
      onClose={onClose}
      closeOnClickAway
    >
      <div className="flex h-[28px] flex-row items-center justify-between">
        <h1 className="text-heading4 text-neutral-900">Log in or sign up</h1>
        <IconButton
          intent="tertiary"
          size="medium"
          iconName="X"
          className="pr-0 pt-1.5 text-neutral-600"
          onClick={onClose}
        />
      </div>
      <Button
        size="medium"
        className="w-full"
        intent="secondary"
        aria-label="Login with Twitch"
        onClick={handleTwitchLogin}
      >
        Continue with Twitch
      </Button>
      <span className="w-full text-body5 text-neutralGreen-900">
        By logging in, you agree to our{' '}
        <Link
          isExternal
          size="medium"
          className="text-body5 lg:text-body5"
          href={TOKEN_TERMS_AND_CONDITIONS_LINK}
        >
          Terms{'\u00A0'}and{'\u00A0'}conditions
        </Link>
      </span>
    </Modal>
  );
};
