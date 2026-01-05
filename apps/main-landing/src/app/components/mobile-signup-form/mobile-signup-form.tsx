'use client';
import { useState } from 'react';
import { Button } from '@idriss-xyz/ui/button';
import { Input } from '@idriss-xyz/ui/input';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { MobileNotSupported } from '@idriss-xyz/ui/mobile-not-supported';
import {
  CREATOR_API_URL,
  PRIVACY_POLICY_LINK,
  TERMS_OF_SERVICE_LINK,
} from '@idriss-xyz/constants';

type Properties = {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileSignupForm = ({ isOpen, onClose }: Properties) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${CREATOR_API_URL}/mobile-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setIsSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  if (isSubmitted) {
    return (
      <MobileNotSupported
        className="bg-[#E7F5E6]/[0.6] backdrop-blur-sm"
        onClose={onClose}
      >
        <div className="flex w-full max-w-[320px] flex-col items-center gap-6">
          <p className="text-balance text-center text-heading5 text-neutralGreen-700">
            Check your inbox. We&apos;ve sent you a link to continue on desktop.
          </p>
        </div>
      </MobileNotSupported>
    );
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
            onKeyDown={async (event) => {
              if (event.key === 'Enter') {
                await handleSubmit();
              }
            }}
            placeholder="Your email"
          />
          {error && (
            <span className="text-center text-label5 text-red-500">
              {error}
            </span>
          )}
          <Button
            size="medium"
            intent="primary"
            className="w-full uppercase"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading || !email}
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
