import { Button } from '@idriss-xyz/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { Icon as IdrissIcon } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { NumericInput } from '@idriss-xyz/ui/numeric-input';
import { useWallet } from '@idriss-xyz/wallet-connect';

import { Closable, Icon, LazyImage } from 'shared/ui';
import { useCommandQuery } from 'shared/messaging';
import { GetEnsInfoCommand } from 'application/trading-copilot';

import {
  TradingCopilotDialogProperties,
  TradingCopilotDialogFormValues,
} from './trading-copilot-dialog.types';

const EMPTY_FORM: TradingCopilotDialogFormValues = {
  amount: '',
};

export const TradingCopilotDialog = ({
  dialog: { details, user },
  closeDialog,
}: TradingCopilotDialogProperties) => {
  const { wallet, isConnectionModalOpened, openConnectionModal } = useWallet();

  const form = useForm<TradingCopilotDialogFormValues>({
    defaultValues: EMPTY_FORM,
  });

  const avatarQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: details.name,
      infoKey: 'avatar',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <Closable
      className="fixed left-0 top-0 z-portal size-full bg-black/50"
      hideCloseButton
    >
      <div className="flex size-full items-center justify-center">
        <div className="flex w-[400px] flex-col gap-y-5 rounded-lg border border-black/20 bg-white p-5">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-heading4 text-neutral-900">Trading copilot</h1>
            <IconButton
              intent="tertiary"
              size="medium"
              iconName="X"
              onClick={closeDialog}
            />
          </div>
          <div className="grid grid-cols-[48px,1fr] gap-2">
            <LazyImage
              src={avatarQuery.data}
              className="size-12 rounded-full border border-neutral-400 bg-neutral-200"
              fallbackComponent={
                <div className="flex size-12 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
                  <Icon
                    size={30}
                    name="PersonIcon"
                    className="text-neutral-500"
                  />
                </div>
              }
            />
            <div className="flex w-full flex-col">
              <p className="text-label3 text-neutral-900">
                {details.name}{' '}
                <span className="text-body3 text-neutral-600">
                  purchased {details.amount} {details.crypto}
                </span>
              </p>
              <p className="text-body6 text-mint-700">{details.when}</p>
            </div>
          </div>
          <form className="mt-1">
            <div className="flex flex-row items-center justify-between">
              <label
                htmlFor="cryptoAmount"
                className="block text-label4 text-neutralGreen-700"
              >
                Amount
              </label>
              <p className="text-body6 text-neutral-500">
                Balance: {user.balance} {user.crypto}
              </p>
            </div>
            <Controller
              control={form.control}
              name="amount"
              render={({ field: { value, onChange } }) => {
                return (
                  <span className="relative mt-2 flex">
                    <NumericInput
                      value={value}
                      placeholder="ETH"
                      onChange={onChange}
                      className="ps-[60px] text-right"
                    />
                    <div className="pointer-events-none absolute start-0 top-1/2 flex h-full w-12 -translate-y-1/2 items-center justify-center after:absolute after:right-0 after:top-1.5 after:h-[calc(100%_-_12px)] after:w-px after:bg-neutral-200">
                      <span className="flex size-6 items-center justify-center rounded-full bg-neutral-200">
                        <IdrissIcon
                          size={18}
                          name="Eth"
                          className="text-neutral-700"
                        />
                      </span>
                    </div>
                  </span>
                );
              }}
            />
          </form>
          <div className="mt-5">
            {wallet ? (
              <Button
                intent="primary"
                size="medium"
                className="w-full"
                type="submit"
              >
                BUY
              </Button>
            ) : (
              <Button
                intent="primary"
                size="medium"
                onClick={openConnectionModal}
                className="w-full"
                loading={isConnectionModalOpened}
              >
                LOG IN
              </Button>
            )}
          </div>
        </div>
      </div>
    </Closable>
  );
};
