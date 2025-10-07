import { Form } from '@idriss-xyz/ui/form';
import { Tabs } from '@idriss-xyz/ui/tabs';
import { Badge } from '@idriss-xyz/ui/badge';
import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@idriss-xyz/ui/tooltip';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { classes } from '@idriss-xyz/ui/utils';
import { Controller, UseFormReturn } from 'react-hook-form';
import {
  NftBalance,
  PRIVACY_POLICY_LINK,
  TERMS_OF_SERVICE_LINK,
  Token,
} from '@idriss-xyz/constants';

import { CreatorProfile } from '../../../types';
import { FormPayload } from '../../../schema';
import { SenderReturnType } from '../../../hooks/use-sender';

import { TokenTabContent } from './token-tab';
import { CollectibleTabContent } from './collectible-tab';

type Properties = {
  creatorInfo: CreatorProfile;
  formMethods: UseFormReturn<FormPayload>;
  activeTab: 'token' | 'collectible';
  setActiveTab: (tab: 'token' | 'collectible') => void;
  defaultTokenSymbol: string;
  possibleTokens: Token[];
  allowedChainsIds: number[];
  sender: SenderReturnType;
  selectedTokenSymbol: string;
  selectedCollectible: NftBalance | null;
  setSelectedCollectible: (c: NftBalance | null) => void;
  collectibleAmount?: number;
  isConnected: boolean;
  openConnectModal?: () => void;
  setPendingCollectibleModal: (pending: boolean) => void;
  submitError: string | null;
  onSubmit: (values: FormPayload) => void;
  amount?: number;
  minimumSfxAmount: number;
};

export function DonateFormBody({
  creatorInfo,
  formMethods,
  activeTab,
  setActiveTab,
  defaultTokenSymbol,
  possibleTokens,
  allowedChainsIds,
  sender,
  selectedTokenSymbol,
  selectedCollectible,
  setSelectedCollectible,
  collectibleAmount,
  isConnected,
  openConnectModal,
  setPendingCollectibleModal,
  submitError,
  onSubmit,
  amount,
  minimumSfxAmount,
}: Properties) {
  return (
    <Form
      onSubmit={formMethods.handleSubmit(onSubmit, (errors) => {
        console.error('Form validation errors:', errors);
      })}
      className="w-full"
    >
      <div>
        {creatorInfo.collectibleEnabled && creatorInfo.tokenEnabled ? (
          <Tabs
            initialTab={activeTab}
            onChange={(value) => {
              formMethods.setValue(
                'type',
                value === 'token' ? 'token' : 'erc1155',
              );
              setActiveTab(value as 'token' | 'collectible');
            }}
            items={[
              {
                key: 'token',
                label: 'TOKEN',
                children: (
                  <TokenTabContent
                    formMethods={formMethods}
                    defaultTokenSymbol={defaultTokenSymbol}
                    possibleTokens={possibleTokens}
                    allowedChainsIds={allowedChainsIds}
                    sender={sender}
                    selectedTokenSymbol={selectedTokenSymbol}
                    activeTab={activeTab}
                  />
                ),
              },
              {
                key: 'collectible',
                label: 'COLLECTIBLE',
                children: (
                  <CollectibleTabContent
                    selectedCollectible={selectedCollectible}
                    amount={collectibleAmount}
                    setSelectedCollectible={setSelectedCollectible}
                    setIsCollectibleModalOpen={() => {}}
                    isConnected={isConnected}
                    openConnectModal={openConnectModal}
                    setPendingCollectibleModal={setPendingCollectibleModal}
                  />
                ),
              },
            ]}
          />
        ) : (
          <>
            {creatorInfo.tokenEnabled && (
              <TokenTabContent
                formMethods={formMethods}
                defaultTokenSymbol={defaultTokenSymbol}
                possibleTokens={possibleTokens}
                allowedChainsIds={allowedChainsIds}
                sender={sender}
                selectedTokenSymbol={selectedTokenSymbol}
                activeTab={activeTab}
              />
            )}
            {creatorInfo.collectibleEnabled && (
              <CollectibleTabContent
                selectedCollectible={selectedCollectible}
                amount={collectibleAmount}
                setSelectedCollectible={setSelectedCollectible}
                setIsCollectibleModalOpen={() => {}}
                isConnected={isConnected}
                openConnectModal={openConnectModal}
                setPendingCollectibleModal={setPendingCollectibleModal}
              />
            )}
          </>
        )}
      </div>

      {creatorInfo.alertEnabled && (
        <Controller
          name="message"
          control={formMethods.control}
          render={({ field, fieldState }) => {
            return (
              <Form.Field
                {...field}
                label={
                  <div className="flex items-center gap-2">
                    <label>Message</label>
                    {creatorInfo.minimumAlertAmount > 0 && (
                      <Badge type="info" variant="subtle">
                        Alert ${creatorInfo.minimumAlertAmount}+
                      </Badge>
                    )}
                    {creatorInfo.minimumTTSAmount > 0 &&
                      creatorInfo.ttsEnabled && (
                        <Badge type="info" variant="subtle">
                          TTS ${creatorInfo.minimumTTSAmount}+
                        </Badge>
                      )}
                  </div>
                }
                className="mt-4"
                helperText={fieldState.error?.message}
                error={Boolean(fieldState.error?.message)}
              />
            );
          }}
        />
      )}

      {creatorInfo.sfxEnabled && (
        <Controller
          name="sfx"
          control={formMethods.control}
          render={({ field, fieldState }) => {
            return (
              <Form.Field
                {...field}
                label={
                  <div className="flex items-center gap-x-1">
                    <label htmlFor="sfx">AI sound effect</label>
                    {creatorInfo.minimumSfxAmount > 0 &&
                      creatorInfo.sfxEnabled && (
                        <Badge type="info" variant="subtle">
                          SFX ${creatorInfo.minimumSfxAmount}+
                        </Badge>
                      )}
                    <TooltipProvider delayDuration={400}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Icon name="HelpCircle" size={15} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-left text-white">
                          <p className={classes('text-label6')}>
                            Type what you want to hear. AI will turn it into a
                            sound effect <br />
                            and replace the default sound. You can{' '}
                            <a
                              href="https://elevenlabs.io/sound-effects"
                              className={classes('text-mint-500 underline')}
                              target="_blank"
                              rel="noreferrer"
                            >
                              test it
                            </a>{' '}
                            before sending.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                }
                className="mt-4"
                helperText={fieldState.error?.message}
                error={Boolean(fieldState.error?.message)}
                placeholder={
                  amount && amount < minimumSfxAmount ? '🔒' : undefined
                }
                placeholderTooltip={`This feature unlocks for donations of $${minimumSfxAmount} or more`}
                disabled={amount !== undefined && amount < minimumSfxAmount}
              />
            );
          }}
        />
      )}

      <Tooltip>
        <TooltipTrigger asChild className="w-full">
          <Button
            size="medium"
            type="submit"
            intent="primary"
            className="mt-6 w-full"
            prefixIconName="Coins"
            disabled={activeTab === 'collectible' && !selectedCollectible}
          >
            Donate
          </Button>
        </TooltipTrigger>
        <TooltipContent
          hidden={
            (activeTab === 'collectible' && selectedCollectible != null) ||
            activeTab === 'token'
          }
          className={classes('z-portal bg-black text-white')}
          side="bottom"
        >
          <p className={classes('text-body6')}>Select a collectible first</p>
        </TooltipContent>
      </Tooltip>

      {submitError && (
        <div
          className={classes(
            'mt-1 flex items-start gap-x-1 text-label7 text-red-500 lg:text-label6',
          )}
        >
          <Icon name="AlertCircle" size={16} className="p-px" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="mt-4 w-full py-3 text-center">
        <span className={classes('text-label7 text-neutral-500')}>
          By donating, you agree to the{' '}
          <ExternalLink
            className={classes('text-mint-600 underline')}
            href={TERMS_OF_SERVICE_LINK}
          >
            Terms of service
          </ExternalLink>{' '}
          and{' '}
          <ExternalLink
            className={classes('text-mint-600 underline')}
            href={PRIVACY_POLICY_LINK}
          >
            Privacy policy
          </ExternalLink>
        </span>
      </div>
    </Form>
  );
}
