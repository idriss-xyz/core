'use client';

import { useState } from 'react';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { getAccessToken, usePrivy } from '@privy-io/react-auth';
import { type Hex } from 'viem';
import { Link } from '@idriss-xyz/ui/link';
import { Icon } from '@idriss-xyz/ui/icon';
import Image from 'next/image';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Checkbox } from '@idriss-xyz/ui/checkbox';

import { IDRISS_SCENE_STREAM_4, backgroundLines2 } from '@/assets';
import { useAuth } from '@/app/creators/context/auth-context';
import { CopyInput } from '@/app/creators/components/copy-input/copy-input';
import {
  FormFieldWrapper,
  SectionHeader,
} from '@/app/creators/components/layout';
import { ConfirmationModal } from '@/app/creators/components/confirmation-modal';
import { useToast } from '@/app/creators/context/toast-context';

import { useLogout } from '../../hooks/use-logout';
import { editCreatorProfile, deleteCreatorAccount } from '../../utils';

const handleDeleteAccount = async (
  toast: ReturnType<typeof useToast>['toast'],
  handleLogout: () => Promise<void>,
) => {
  try {
    const authToken = await getAccessToken();
    if (!authToken) {
      toast({
        type: 'error',
        heading: 'Unable to delete account',
        description: 'Please try again later',
        autoClose: true,
      });
      return;
    }

    await deleteCreatorAccount(authToken);

    toast({
      type: 'success',
      heading: 'Account deleted',
      autoClose: true,
    });

    await handleLogout();
  } catch (error) {
    console.error('Failed to delete account:', error);
    toast({
      type: 'error',
      heading: 'Unable to delete account',
      description: 'Please try again later',
      autoClose: true,
    });
  }
};

// ts-unused-exports:disable-next-line
export default function ProfilePage() {
  const [isExportWalletModalOpen, setIsExportWalletModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const [receiveEmails, setReceiveEmails] = useState(true);

  const { creator } = useAuth();
  const { user, exportWallet } = usePrivy();
  const handleLogout = useLogout();
  const { toast } = useToast();
  const address = user?.wallet?.address as Hex | undefined;

  const handleEmailPreferencesSave = async () => {
    if (!creator?.name) {
      console.error('Creator name not found');
      toast({
        type: 'error',
        heading: 'Unable to save settings',
        description: 'Please try again later',
        autoClose: true,
      });
      return;
    }
    try {
      const authToken = await getAccessToken();
      if (!authToken) {
        console.error('Not authenticated');
        toast({
          type: 'error',
          heading: 'Unable to save settings',
          description: 'Please try again later',
          autoClose: true,
        });
        return;
      }

      setReceiveEmails((previous) => {
        return !previous;
      });

      await editCreatorProfile(creator.name, { receiveEmails }, authToken);
      toast({
        type: 'success',
        heading: 'Settings saved',
        autoClose: true,
      });
    } catch (error) {
      console.error('Failed to save email:', error);
      toast({
        type: 'error',
        heading: 'Unable to save settings',
        description: 'Please try again later',
        autoClose: true,
      });
    }
  };

  const profileImageUrl = creator?.profilePictureUrl;
  const profileImageSize = 80;
  const bannerHeight = 150;

  return (
    <>
      <div className="flex size-full flex-col gap-4">
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

        <Card>
          <FormFieldWrapper>
            <SectionHeader
              title="Email preferences"
              subtitle="We may email you about important things like logins, payouts, and account security. You can choose whether to receive additional updates below."
            />
            <Checkbox
              rootClassName="border-neutral-200"
              onChange={handleEmailPreferencesSave}
              value={receiveEmails}
              label={
                <span className="w-full text-body5 text-neutralGreen-900">
                  Send me updates about new features, donation activity, and
                  earning opportunities
                </span>
              }
            />
          </FormFieldWrapper>
        </Card>

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
                <div className="relative flex max-w-[616px] flex-row items-center gap-4 rounded-xl bg-white/80 p-4">
                  <GradientBorder
                    gradientDirection="toRight"
                    borderRadius={12}
                    gradientStopColor="#E8FCE3"
                  />
                  <CopyInput
                    value={address ?? ''}
                    message="Your address has been copied"
                    className="w-full"
                  />
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
                    intent="secondary"
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
        title="Are you sure you want to reveal your secret recovery phrase?"
        sectionSubtitle="Anyone who sees this phrase can steal your funds. Never share it. Never show it. Only proceed if you’re in a private, secure environment."
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
      <ConfirmationModal
        isOpened={isDeleteAccountModalOpen}
        onClose={() => {
          return setIsDeleteAccountModalOpen(false);
        }}
        onConfirm={() => {
          return handleDeleteAccount(toast, handleLogout);
        }}
        title="Are you sure you want to delete your account?"
        sectionSubtitle="Your account will be permanently deleted. This cannot be undone. This will permanently delete your account and remove your data from our service."
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
    </>
  );
}
