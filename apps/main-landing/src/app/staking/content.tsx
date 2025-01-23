'use client';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button } from '@idriss-xyz/ui/button';
import { backgroundLines2 } from '@/assets';
import idrissSceneStream from './assets/IDRISS_SCENE_STREAM_4_2 1.png';
import idrissCoin from './assets/IDRISS_COIN 1.png';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Controller, useForm } from 'react-hook-form';
import { Icon } from '@idriss-xyz/ui/icon';
import { Form } from '@idriss-xyz/ui/form';

type FormPayload = {
  amount: number;
};

export const StakingContent = () => {
  const { isConnected } = useAccount();

  const { disconnect } = useDisconnect();
  const { connectModalOpen, openConnectModal } = useConnectModal();

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      amount: 1,
    },
    mode: 'onSubmit',
  });
  return (
    <main className="relative flex min-h-screen grow flex-col items-center justify-around overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] lg:flex-row lg:items-start lg:justify-center lg:px-0">
      <img
        src={idrissSceneStream.src}
        className="pointer-events-none absolute left-[-310px] top-[-20px] z-1 h-[1440px] w-[2306.px] min-w-[120vw] max-w-none rotate-[25.903deg] lg:block"
        alt=""
      />
      <img
        src={backgroundLines2.src}
        className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
        alt=""
      />

      <div className="flex flex-col">
        <div className="z-[5] inline-flex flex-col items-center gap-[78px] overflow-hidden px-4 pb-3 lg:mt-[78px] lg:[@media(max-height:800px)]:mt-[60px]">
          <img className="size-[137px]" src={idrissCoin.src} alt="" />
          <div className="relative flex flex-row rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
            <GradientBorder
              gradientDirection="toTop"
              gradientStopColor="rgba(145, 206, 154, 0.50)"
              borderWidth={1}
            />
            <div className="flex w-[459px] flex-col gap-6">
              <span className="text-label3 text-neutralGreen-700">
                STAKE | UNSTAKE
              </span>
              <Form className="w-full">
                <Controller
                  control={formMethods.control}
                  name="amount"
                  render={({ field }) => {
                    return (
                      <Form.Field
                        {...field}
                        className="mt-6"
                        value={field.value.toString()}
                        onChange={(value) => {
                          field.onChange(Number(value));
                        }}
                        label="Amount"
                        numeric
                      />
                    );
                  }}
                />
              </Form>

              <Button
                intent="primary"
                size="large"
                className="w-full"
                onClick={() => {}}
              >
                STAKE
              </Button>
            </div>
            <div className="mx-10 w-px bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] opacity-50" />
            <div className="flex w-[389px] flex-col">
              <div className="flex flex-col gap-4">
                <span className="pb-6 text-label3 text-neutralGreen-700">
                  STAKING BENEFIT
                </span>
                <div className="flex gap-2">
                  <Icon name="PiggyBank" size={24} className="text-gray-300" />
                  <span className="text-body3 text-neutralGreen-700">
                    Earn <span className="gradient-text">12% APR</span> on
                    staked amounts
                  </span>
                </div>
                <div className="flex gap-2">
                  <Icon name="Gem" size={24} className="text-gray-300" />
                  <span className="text-body3 text-neutralGreen-700">
                    Stake <span className="gradient-text">10,000 $IDRISS</span>{' '}
                    or more to unlock all premium features
                  </span>
                </div>
                <div className="flex gap-2">
                  <Icon name="PieChart" size={24} className="text-gray-300" />
                  <span className="text-body3 text-neutralGreen-700">
                    Access to decentralized revenue sharing
                  </span>
                </div>
              </div>

              <Button
                intent="tertiary"
                size="medium"
                isExternal
                asLink
                className="mt-8 w-full"
                suffixIconName="ArrowRight"
                href="#"
              >
                LEARN MORE
              </Button>
            </div>
          </div>
        </div>
        {isConnected ? (
          <div className="relative z-10 flex w-full flex-col items-center gap-2 rounded-2xl bg-[rgba(255,255,255,0.5)] px-5 py-3 backdrop-blur-[45px]">
            <span className="text-heading6 text-neutralGreen-700">
              All good, your wallet is connected!
            </span>
            <Button
              intent="secondary"
              size="small"
              className="w-full"
              onClick={() => {
                disconnect();
              }}
            >
              DISCONNECT WALLET
            </Button>
          </div>
        ) : (
          <Button
            intent="primary"
            size="medium"
            className="mt-6 w-full"
            onClick={openConnectModal}
            loading={connectModalOpen}
          >
            CONNECT WALLET
          </Button>
        )}
      </div>
    </main>
  );
};
