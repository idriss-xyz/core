'use client';

import { useState } from 'react';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { usePrivy } from '@privy-io/react-auth';
import { type Hex } from 'viem';
import { Link } from '@idriss-xyz/ui/link';
import { Icon } from '@idriss-xyz/ui/icon';
import Image from 'next/image';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import { IDRISS_SCENE_STREAM_4, backgroundLines2 } from '@/assets';
import { useAuth } from '@/app/creators/context/auth-context';
import { CopyInput } from '@/app/creators/components/copy-input/copy-input';
import {
  FormFieldWrapper,
  SectionHeader,
} from '@/app/creators/components/layout';
import { ConfirmationModal } from '@/app/creators/components/confirmation-modal';

const handleDeleteAccount = () => {
  // TODO: Implement backend call to save email
  console.log('Deleteing Account');
};

// ts-unused-exports:disable-next-line
export default function ProfilePage() {
  const [isExportWalletModalOpen, setIsExportWalletModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  const { creator } = useAuth();
  const { user, exportWallet } = usePrivy();
  const address = user?.wallet?.address as Hex | undefined;

  // TODO: add back when email saving comes back, including `getAccessToken` in usePrivy()
  // const email = creator?.email ?? user?.email?.address ?? '';

  // const handleEmailSave = async (newEmail: string) => {
  //   if (!creator?.name) {
  //     console.error('Creator name not found');
  //     return;
  //   }
  //   try {
  //     const authToken = await getAccessToken();
  //     if (!authToken) {
  //       console.error('Not authenticated');
  //       return;
  //     }
  //     await editCreatorProfile(creator.name, { email: newEmail }, authToken);
  //   } catch (error) {
  //     console.error('Failed to save email:', error);
  //   }
  // };

  const profileImageUrl = creator?.profilePictureUrl;
  const profileImageSize = 80;
  const bannerHeight = 150;

  return (
    <>
      <div className="mb-3 flex size-full flex-col gap-4">
        <h1 className="col-span-3 text-heading3">Profile</h1>

        <Card>
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="relative overflow-hidden rounded-2xl bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)]"
              style={{ height: `${bannerHeight}px` }}
            >
              <img
                alt="lines"
                src={backgroundLines2.src}
                className="absolute z-0 w-full opacity-40"
              />
              <img
                alt="idriss stream"
                src={IDRISS_SCENE_STREAM_4.src}
                className="absolute top-[-225px] z-0 w-full"
              />
            </div>
            <div className="rounded-b-2xl bg-white px-4 pt-12 text-center">
              <h2 className="text-heading4">{creator?.name}</h2>
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${bannerHeight}px` }}
            >
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={creator?.name ?? 'Creator profile picture'}
                  width={profileImageSize}
                  height={profileImageSize}
                  className="rounded-full border-2 border-white bg-gray-200"
                  style={{
                    width: `${profileImageSize}px`,
                    height: `${profileImageSize}px`,
                  }}
                />
              ) : (
                <div
                  className="flex items-center justify-center rounded-full border-4 border-white bg-gray-200"
                  style={{
                    width: `${profileImageSize}px`,
                    height: `${profileImageSize}px`,
                  }}
                >
                  <Icon
                    name="UserRound"
                    className="text-neutral-400"
                    size={48}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* TODO: Unhide when we introduce updates */}
        {/* <Card>
          <FormFieldWrapper>
            <SectionHeader
              title="Updates"
              subtitle="We'll use it to send updates about your account or the app"
            />
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="pb-1 text-label4">Email</span>
                <div className="relative flex w-fit flex-row items-center rounded-xl bg-white/80">
                  <EnterInput
                    initialValue={email ?? ''}
                    onSave={handleEmailSave}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>
          </FormFieldWrapper>
        </Card> */}

        <Card>
          <FormFieldWrapper>
            <SectionHeader
              title="Crypto wallet"
              subtitle="Access your wallet address and secret phrase"
            />
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="pb-1 text-label4">Wallet address</span>
                <p className="max-w-[76ch] text-body5 text-neutral-600">
                  This is your public wallet address. It was automatically
                  created for your account and linked to your donation page. We
                  show it only for reference and you do not need it to use the
                  app.
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
                  <p className="max-w-[66ch] text-body5 text-neutral-600">
                    This phrase gives full access to your wallet and funds.
                    Never share it with anyone and store it only in a secure
                    offline environment.{' '}
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
                    onClick={() => {
                      return setIsExportWalletModalOpen(true);
                    }}
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

        <Card>
          <FormFieldWrapper>
            <SectionHeader title="Account" />
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
                  <Button
                    size="medium"
                    intent="negative"
                    onClick={() => {
                      return setIsDeleteAccountModalOpen(true);
                    }}
                    className="size-fit"
                    suffixIconName="Trash2"
                  >
                    DELETE ACCOUNT
                  </Button>
                </div>
              </div>
            </div>
          </FormFieldWrapper>
        </Card>
      </div>
      <ConfirmationModal
        isOpened={isExportWalletModalOpen}
        onClose={() => {
          return setIsExportWalletModalOpen(false);
        }}
        onConfirm={exportWallet}
        title="Are you sure?"
        sectionTitle="⚠️ Are you sure you want to reveal your recovery phrase?"
        sectionSubtitle="Anyone who sees this phrase can steal your funds. Never share it. Never show it. Only proceed if you’re in a private, secure environment."
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
      <ConfirmationModal
        isOpened={isDeleteAccountModalOpen}
        onClose={() => {
          return setIsDeleteAccountModalOpen(false);
        }}
        onConfirm={handleDeleteAccount}
        title="Final confirmation required"
        sectionTitle="Are you sure you want to delete your account?"
        sectionSubtitle="Your account will be permanently deleted. This cannot be undone."
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
    </>
  );
}
