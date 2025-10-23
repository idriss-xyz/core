'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from '@idriss-xyz/ui/card';
import { Icon } from '@idriss-xyz/ui/icon';
import { usePrivy } from '@privy-io/react-auth';

import { useAuth } from '../context/auth-context';

// ts-unused-exports:disable-next-line
export default function Home() {
  const { creator } = useAuth();
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (creator && ready && authenticated && user?.wallet?.address) {
      if (creator.doneSetup) {
        router.replace('/app/earnings/stats-and-history');
      } else {
        router.replace('/app/setup/payment-methods');
      }
    }
  }, [creator, router, ready, authenticated, user?.wallet?.address]);
  return (
    <div role="status">
      <div className="grid animate-pulse grid-cols-3 gap-3">
        {/* Card 1: Transactions */}
        <Card className="col-span-1 flex flex-col border border-neutral-200 bg-white p-0 shadow-none">
          {[...Array.from({ length: 3 }).keys()].map((index) => {
            return (
              <div key={index} className="flex flex-col gap-[6px] p-8">
                <div className="flex h-[10px] flex-row justify-between gap-3">
                  <div className="h-full w-[250px] rounded-md bg-neutral-100" />
                  <div className="h-full w-[39px] rounded-md bg-neutral-100" />
                </div>
                <div className="flex h-[10px] w-full">
                  <div className="h-full w-[120px] rounded-md bg-neutral-100" />
                </div>
                <div className="flex h-[10px] w-full">
                  <div className="h-full w-[120px] rounded-md bg-neutral-100" />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Card 2: Total earnings */}
        <Card className="col-span-1 flex flex-col justify-end border border-neutral-200 bg-white p-0 shadow-none">
          <div className="h-[182px] overflow-hidden">
            <svg
              width="432"
              height="232"
              viewBox="0 0 432 232"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 130C17 125.582 20.5817 122 25 122H38.8889C43.3072 122 46.8889 125.582 46.8889 130V202C46.8889 206.418 43.3072 210 38.8889 210H25C20.5817 210 17 206.418 17 202V130Z"
                fill="#F6F7F8"
              />
              <path
                d="M62.8887 151C62.8887 146.582 66.4704 143 70.8887 143H84.7776C89.1958 143 92.7776 146.582 92.7776 151V202C92.7776 206.418 89.1958 210 84.7776 210H70.8887C66.4704 210 62.8887 206.418 62.8887 202V151Z"
                fill="#F6F7F8"
              />
              <path
                d="M108.777 174C108.777 169.582 112.359 166 116.777 166H130.666C135.085 166 138.666 169.582 138.666 174V202C138.666 206.418 135.085 210 130.666 210H116.777C112.359 210 108.777 206.418 108.777 202V174Z"
                fill="#F6F7F8"
              />
              <path
                d="M154.666 67C154.666 62.5817 158.248 59 162.666 59H176.555C180.973 59 184.555 62.5817 184.555 67V202C184.555 206.418 180.973 210 176.555 210H162.666C158.248 210 154.666 206.418 154.666 202V67Z"
                fill="#F6F7F8"
              />
              <path
                d="M200.555 146C200.555 141.582 204.136 138 208.555 138H222.444C226.862 138 230.444 141.582 230.444 146V202C230.444 206.418 226.862 210 222.444 210H208.555C204.136 210 200.555 206.418 200.555 202V146Z"
                fill="#F6F7F8"
              />
              <path
                d="M246.445 141C246.445 136.582 250.027 133 254.445 133H268.334C272.752 133 276.334 136.582 276.334 141V202C276.334 206.418 272.752 210 268.334 210H254.445C250.027 210 246.445 206.418 246.445 202V141Z"
                fill="#F6F7F8"
              />
              <path
                d="M292.334 141C292.334 136.582 295.916 133 300.334 133H314.223C318.641 133 322.223 136.582 322.223 141V202C322.223 206.418 318.641 210 314.223 210H300.334C295.916 210 292.334 206.418 292.334 202V141Z"
                fill="#F6F7F8"
              />
              <path
                d="M338.223 141C338.223 136.582 341.804 133 346.223 133H360.112C364.53 133 368.112 136.582 368.112 141V202C368.112 206.418 364.53 210 360.112 210H346.223C341.804 210 338.223 206.418 338.223 202V141Z"
                fill="#F6F7F8"
              />
              <path
                d="M384.111 141C384.111 136.582 387.693 133 392.111 133H406C410.419 133 414 136.582 414 141V202C414 206.418 410.418 210 406 210H392.111C387.693 210 384.111 206.418 384.111 202V141Z"
                fill="#F6F7F8"
              />
              <path
                d="M0 16C0 7.16344 7.16344 0 16 0H416C424.837 0 432 7.16344 432 16V209C432 217.837 424.837 225 416 225H16C7.16343 225 0 217.837 0 209V16Z"
                fill="url(#paint0_linear_6481_25070)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_6481_25070"
                  x1="216"
                  y1="0"
                  x2="216"
                  y2="225"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.1" />
                  <stop offset="1" stopColor="white" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </Card>

        {/* Card 3: Earnings by asset */}
        <Card className="col-span-1 flex flex-col border border-neutral-200 bg-white p-0 shadow-none">
          <div className="flex items-center gap-4 px-6 py-8">
            <div className="size-[62px] rounded-full bg-neutral-100" />
            <div className="flex flex-col gap-[6px]">
              <div className="flex h-[10px] flex-row justify-between gap-3">
                <div className="h-full w-[198px] rounded-md bg-neutral-100" />
              </div>
              <div className="flex h-[10px] w-full">
                <div className="h-full w-[120px] rounded-md bg-neutral-100" />
              </div>
              <div className="flex h-[10px] w-full">
                <div className="h-full w-[120px] rounded-md bg-neutral-100" />
              </div>
            </div>
          </div>
          {[...Array.from({ length: 3 }).keys()].map((index) => {
            return (
              <div
                key={index}
                className="flex h-[71px] items-center gap-4 px-10 py-8"
              >
                <div className="size-9 rounded-full bg-neutral-100" />
                {[...Array.from({ length: 3 }).keys()].map((index) => {
                  return (
                    <div
                      key={index}
                      className="col-span-1 h-[10px] w-[55px] rounded-md bg-neutral-100"
                    />
                  );
                })}
              </div>
            );
          })}
        </Card>

        {/* Card 4: Donation History */}
        <Card className="col-span-3 bg-white p-0 shadow-none">
          <div className="flex w-full flex-col gap-y-4">
            {Array.from({ length: 8 }).map((_, index) => {
              return (
                <div
                  key={index}
                  className="flex h-[87.4px] items-center rounded-md border-b border-b-neutral-200"
                >
                  <div className="w-[1090px] px-4">
                    <div className="flex h-8 items-center gap-2">
                      <div className="size-8 rounded-full bg-neutral-100" />
                      <div className="flex flex-col gap-2">
                        <div className="flex h-[10px] flex-row justify-between gap-3">
                          <div className="h-full w-[250px] rounded-md bg-neutral-100" />
                          <div className="h-full w-[39px] rounded-md bg-neutral-100" />
                        </div>
                        <div className="flex h-[10px] w-full">
                          <div className="h-full w-[120px] rounded-md bg-neutral-100" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[48px] px-2">
                    <Icon
                      name="EllipsisVertical"
                      className="text-neutral-200"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
