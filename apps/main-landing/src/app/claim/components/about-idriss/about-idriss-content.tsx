import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { useEffect, useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';

import { useClaimPage } from '../../claim-page-context';

import { formatTime } from './utils';

export const AboutIdrissContent = () => {
  const { setCurrentContent } = useClaimPage();
  const videoReference = useRef<HTMLVideoElement>(null);
  const [remainingTime, setRemainingTime] = useState<number>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);

  const updateTime = () => {
    if (videoReference.current) {
      const time =
        videoReference.current.duration - videoReference.current.currentTime;
      setRemainingTime(Math.floor(time));
    }
  };

  const handleVideoEnd = () => {
    setIsSuccess(true);
    if (videoReference.current) {
      videoReference.current.pause();
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isSuccess) {
        return;
      }

      if (document.hidden) {
        videoReference.current?.pause();
      } else {
        void videoReference.current?.play();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSuccess]);

  return (
    <div className="relative z-[5] flex w-[800px] flex-col items-center gap-10 rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
      <GradientBorder
        gradientDirection="toTop"
        gradientStopColor="rgba(145, 206, 154, 0.50)"
        borderWidth={1}
      />
      <div className="relative flex h-[405px] w-[720px] flex-col items-center gap-2 rounded-3xl bg-neutral-900">
        <GradientBorder
          gradientDirection="toBottom"
          gradientStopColor="rgba(145, 206, 154)"
          gradientStartColor="rgba(255, 255, 255, 0.1)"
          borderWidth={2}
          borderRadius={24}
        />
        <video
          ref={videoReference}
          autoPlay
          muted
          onTimeUpdate={updateTime}
          onEnded={handleVideoEnd}
          className="pointer-events-none w-full rounded-3xl"
          loop={false}
          onClick={(event) => {
            return event.preventDefault();
          }}
        >
          <source src="/videos/brand-intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {remainingTime !== 0 && (
          <div className="pointer-events-none absolute bottom-2 left-2 mt-4 min-h-[25px] min-w-[60px] rounded-md bg-black/30 px-2 py-1 text-center text-body5 text-white">
            {remainingTime && (
              <span className="animate-fade-in duration-75">
                {formatTime(remainingTime)}
              </span>
            )}
          </div>
        )}
      </div>

      <TooltipProvider delayDuration={400}>
        <Tooltip open={isSuccess ? false : shouldShowTooltip}>
          <TooltipTrigger asChild>
            <div
              onMouseEnter={() => {
                setShouldShowTooltip(true);
              }}
              onMouseLeave={() => {
                setShouldShowTooltip(false);
              }}
            >
              <Button
                intent="primary"
                size="large"
                suffixIconName="ArrowRight"
                className="w-56"
                onClick={() => {
                  setCurrentContent('check-eligibility');
                }}
                disabled={!isSuccess}
              >
                Next
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent className="w-fit bg-black text-white">
            <span>Watch the video to continue</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
