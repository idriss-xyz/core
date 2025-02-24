import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Link } from '@idriss-xyz/ui/link';
import {
  ANNOUNCEMENT_LINK,
  SNAPSHOT_IDRISS_LINK,
  TOKENOMICS_DOCS_LINK,
} from '@idriss-xyz/constants';
import { BlockedButton } from '@idriss-xyz/ui/blocked-button';
import { Button } from '@idriss-xyz/ui/button';
import { GeoConditionalButton } from '@idriss-xyz/ui/geo-conditional-button';

import { useClaimPage } from '../../claim-page-context';

import geoist_avatar from './assets/geoist_avatar.png';
import levertz_avatar from './assets/levertz_avatar.png';
import user_avatar from './assets/user_avatar.png';

export const LetterContent = () => {
  const airdropEnabled = true;
  const { setCurrentContent } = useClaimPage();

  return (
    <div className="relative z-[5] m-auto flex w-[600px] flex-col items-center gap-10 rounded-[24px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
      <GradientBorder
        gradientDirection="toTop"
        gradientStopColor="rgba(145, 206, 154, 0.50)"
        borderWidth={1}
      />

      <div className="relative flex w-full flex-col items-center gap-2 rounded-[24px] bg-[rgba(255,255,255,0.8)] px-10 py-8">
        <GradientBorder
          borderWidth={2}
          gradientDirection="toBottom"
          gradientStartColor="#ffffff"
          gradientStopColor="rgba(145, 206, 154)"
        />

        <div className="flex flex-col gap-6 text-body5 text-neutralGreen-700">
          <p>GM and congrats, everyone.</p>
          <p>
            We’ve come this far together as a purely community-owned project.
          </p>
          <p className="whitespace-pre">
            But now, back to building apps that solve problems with crypto and
            AI.
          </p>
          <p className="text-balance">
            <Link
              size="s"
              isExternal
              href={TOKENOMICS_DOCS_LINK}
              className="border-none px-0 text-body5 lg:text-body5"
            >
              $IDRISS
            </Link>{' '}
            is your tool to govern{' '}
            <Link
              size="s"
              isExternal
              href={SNAPSHOT_IDRISS_LINK}
              className="border-none px-0 text-body5 lg:text-body5"
            >
              IDRISS DAO
            </Link>{' '}
            and access decentralized revenue sharing from IDRISS apps. With our
            recent{' '}
            <Link
              size="s"
              isExternal
              href={ANNOUNCEMENT_LINK.REBRANDING}
              className="border-none px-0 text-body5 lg:text-body5"
            >
              rebrand
            </Link>{' '}
            (learn more in the next step), we’re doubling down on the mission.
            Want to see more impactful crypto apps? Keep building with us.
          </p>
          <p>We’re just getting started.</p>
          <p>Contributors of IDRISS DAO</p>
        </div>

        <div className="absolute bottom-[-14px] right-[-17px] inline-flex rotate-[13.922deg] flex-col items-center gap-2 rounded-lg bg-white p-[6px] shadow-lg">
          <img
            alt=""
            src={levertz_avatar.src}
            className="h-[70px] rounded-md"
          />
          <span className="text-label5 text-neutral-900">Levertz</span>
        </div>

        <div className="absolute bottom-[-4px] right-[62px] inline-flex rotate-[-4.24deg] flex-col items-center gap-2 rounded-lg bg-white p-[6px] shadow-lg">
          <img alt="" src={geoist_avatar.src} className="h-[70px] rounded-md" />
          <span className="text-label5 text-neutral-900">Geoist</span>
        </div>

        <div className="absolute bottom-[-13px] right-[142px] inline-flex rotate-[-13.603deg] flex-col items-center gap-2 rounded-lg bg-white p-[6px] shadow-lg">
          <img alt="" src={user_avatar.src} className="h-[70px] rounded-md" />
          <span className="text-label5 text-neutral-900">You</span>
        </div>
      </div>

      {airdropEnabled ? (
        <GeoConditionalButton
          defaultButton={
            <Button
              intent="primary"
              size="large"
              suffixIconName="IdrissArrowRight"
              className="w-56"
              onClick={() => {
                setCurrentContent('about-idriss');
              }}
            >
              Next
            </Button>
          }
        />
      ) : (
        <BlockedButton
          buttonClasses="pl-5"
          tooltipClasses="w-max"
          iconName="CalendarClock"
          buttonText="Claim ended"
        >
          <span>Claiming ended at 11:59 PM UTC, February 10.</span>
        </BlockedButton>
      )}
    </div>
  );
};
