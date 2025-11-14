'use client';
import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Link } from '@idriss-xyz/ui/link';

import { backgroundLines2, IDRISS_SCENE_STREAM_4 } from '@/assets';
import { useAuth } from '@/app/context/auth-context';
import { CopyInput } from '@/app/components/copy-input/copy-input';

export default function InviteBanner() {
  const { creator } = useAuth();
  return (
    <Card className="p-0">
      <div className="relative h-[224px] overflow-hidden rounded-2xl bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)]">
        <img
          alt="lines"
          src={backgroundLines2.src}
          className="absolute w-full opacity-40"
        />
        <img
          alt="idriss stream"
          src={IDRISS_SCENE_STREAM_4.src}
          className="absolute bottom-[-200px] lg:bottom-[-260px] xl:bottom-[-350px] 2xl:bottom-[-420px] 4xl:bottom-[-600px]"
        />
        <div className="px-24 py-8">
          <div className="flex max-w-[659px] flex-col gap-3">
            <h2 className="text-display5 uppercase gradient-text">
              HELP YOUR FRIENDS START EARNING
            </h2>
            <div className="relative w-fit rounded-lg bg-white/60 p-4 backdrop-blur-lg">
              <GradientBorder
                gradientDirection="toRight"
                borderRadius={8}
                gradientStopColor="#E8FCE36B"
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <CopyInput
                    value={`https://idriss.xyz/invite/${creator?.name}`}
                    className="w-[496px] bg-white font-medium"
                    textClassName="text-body4"
                  />
                  <span>or</span>
                  <Button
                    size="medium"
                    intent="primary"
                    suffixIconName="TwitterX"
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                      `Streamer friends, come earn on @idriss_xyz with me.\nhttps://idriss.xyz/invite/${creator?.name}`,
                    )}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    asLink
                    isExternal
                  >
                    SHARE
                  </Button>
                </div>
                <p className="text-body6 text-neutral-900">
                  By participating, you agree to the{' '}
                  <Link
                    size="medium"
                    href={TOKEN_TERMS_AND_CONDITIONS_LINK}
                    isExternal
                    className="text-body6 text-mint-700 hover:cursor-pointer lg:text-body6"
                  >
                    Terms and conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
