import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Link } from '@idriss-xyz/ui/link';

import { backgroundLines2, IDRISS_SCENE_STREAM_4 } from '@/assets';
import { CopyInput } from '@/app/creators/components/copy-input/copy-input';

export default function Invites() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-3 p-0">
        <div className="relative h-[250px] overflow-hidden rounded-2xl bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)]">
          <img
            alt="lines"
            src={backgroundLines2.src}
            className="absolute w-full opacity-40"
          />
          <img
            alt="idriss stream"
            src={IDRISS_SCENE_STREAM_4.src}
            className="absolute bottom-[-360px] w-full object-cover object-[center_10%] lg:object-[center_33%] 3xl:object-[center_40%]"
          />
          <div className="px-24 py-8">
            <div className="flex max-w-[659px] flex-col gap-3">
              <h2 className="text-display5 uppercase gradient-text">
                Invite a streamer with 100+ followers. You will both get $10 or
                more.
              </h2>
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
              <div className="relative w-fit rounded-lg bg-white/80 p-4 backdrop-blur-sm">
                <GradientBorder
                  gradientDirection="toRight"
                  borderRadius={8}
                  gradientStopColor="#E8FCE3"
                />
                <div className="flex items-center gap-4">
                  <CopyInput
                    value="https://idriss.xyz/join/creatorname"
                    className="bg-white font-medium"
                  />
                  <span>or</span>
                  <Button size="medium" intent="primary">
                    Post on X
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
