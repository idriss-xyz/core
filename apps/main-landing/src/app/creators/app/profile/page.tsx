'use client';

import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { usePrivy } from '@privy-io/react-auth';
import { type Hex } from 'viem';
import { Link } from '@idriss-xyz/ui/link';
import { Icon } from '@idriss-xyz/ui/icon';
import Image from 'next/image';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import { IDRISS_SCENE_STREAM_4 } from '@/assets';
import { useAuth } from '@/app/creators/context/auth-context';
import { CopyInput } from '@/app/creators/components/copy-input/copy-input';
import {
  FormFieldWrapper,
  SectionHeader,
} from '@/app/creators/components/layout';

// ts-unused-exports:disable-next-line
export default function ProfilePage() {
  const { creator } = useAuth();
  const { user, exportWallet } = usePrivy();
  const address = user?.wallet?.address as Hex | undefined;

  const profileImageUrl = creator?.profilePictureUrl;

  return (
    <div className="mb-4 flex size-full flex-col gap-4">
      <h1 className="col-span-3 text-heading3">Profile</h1>

      <Card>
        <div className="relative">
          <Image
            src={IDRISS_SCENE_STREAM_4.src}
            alt="Profile banner"
            width={1200}
            height={150}
            className="h-[150px] w-full rounded-xl object-cover"
          />
          <div className="absolute left-1/2 top-[150px] -translate-x-1/2 -translate-y-1/2">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={creator?.name ?? 'Creator profile picture'}
                width={80}
                height={80}
                className="size-20 rounded-full border-2 border-white bg-gray-200"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full border-4 border-white bg-gray-200">
                <Icon name="Head" className="size-16 text-neutral-400" />
              </div>
            )}
          </div>
          <div className="px-4 pt-12 text-center">
            <h2 className="mt-4 text-heading4">{creator?.name}</h2>
          </div>
        </div>
      </Card>

      <Card>
        <FormFieldWrapper>
          <SectionHeader
            title="Crypto wallet"
            subtitle="Access your wallet address and secret phrase"
          />
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex flex-col gap-2">
              <span className="pb-1 text-label4">Wallet address</span>
              <p className="max-w-prose text-body5 text-neutral-600">
                This is your public wallet address. It was automatically created
                for your account and linked to your donation page. We show it
                only for reference and you do not need it to use the app.
              </p>
              <div className="relative flex w-fit flex-row items-center gap-4 rounded-xl bg-white/80 p-4">
                <GradientBorder
                  gradientDirection="toRight"
                  borderRadius={12}
                  gradientStopColor="#E8FCE3"
                />
                <CopyInput value={address ?? ''} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="pb-1 text-label4">Secret recovery phrase</span>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
                <p className="max-w-prose text-body5 text-neutral-600">
                  This phrase gives full access to your wallet and funds. Never
                  share it with anyone and store it only in a secure offline
                  environment.{' '}
                  <Link
                    size="medium"
                    href="https://privy-io.notion.site/Transferring-Your-App-Account-9dab9e16c6034a7ab1ff7fa479b02828"
                    isExternal
                    className="text-body5 lg:text-body5"
                  >
                    Learn more about secret recovery phrases
                  </Link>
                </p>
                <Button
                  size="medium"
                  intent="negative"
                  onClick={exportWallet}
                  className="size-fit"
                  suffixIconName="FileUp"
                >
                  EXPORT PHRASE
                </Button>
              </div>
            </div>
          </div>
        </FormFieldWrapper>
      </Card>
    </div>
  );
}
