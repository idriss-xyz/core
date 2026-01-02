'use client';
import { useState } from 'react';
import { Button } from '@idriss-xyz/ui/button';
import { Input } from '@idriss-xyz/ui/input';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { MobileNotSupported } from '@idriss-xyz/ui/mobile-not-supported';
import {
  PRIVACY_POLICY_LINK,
  TERMS_OF_SERVICE_LINK,
} from '@idriss-xyz/constants';

type Properties = {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileSignupForm = ({ isOpen, onClose }: Properties) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // TODO: Implement email submission logic
    console.log('Submitting email:', email);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <MobileNotSupported
      className="bg-[#E7F5E6]/[0.6] backdrop-blur-sm"
      onClose={onClose}
    >
      <div className="flex w-full max-w-[320px] flex-col items-center gap-6">
        <p className="text-balance text-center text-heading5 text-neutralGreen-700">
          This experience is designed for desktop. We&apos;ll email you a link
          to continue on your computer.
        </p>
        <div className="flex w-full flex-col items-center gap-3">
          <Input
            value={email}
            onChange={(event) => {
              return setEmail(event.target.value);
            }}
            placeholder="Your email"
          />
          <Button
            size="medium"
            intent="primary"
            className="w-full uppercase"
            onClick={handleSubmit}
          >
            Send me link
          </Button>
          <span className="text-center text-label5 text-neutral-500">
            By continuing, you agree to our
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
      </div>
    </MobileNotSupported>
  );
};
