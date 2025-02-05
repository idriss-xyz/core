import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { useEffect, useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';
import { Icon } from '@idriss-xyz/ui/icon';

import { useClaimPage } from '../../claim-page-context';

import { formatTime } from './utils';

export const AboutIdrissContent = () => {
  const { setCurrentContent } = useClaimPage();
  const videoReference = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>();

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

  const handleVideoPlay = () => {
    setShowPlayOverlay(false);
  };

  const toggleMute = () => {
    if (videoReference.current) {
      videoReference.current.muted = !videoReference.current.muted;

      setIsMuted(videoReference.current.muted);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isSuccess || showPlayOverlay) {
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
  }, [isSuccess, showPlayOverlay]);

  return (
    <div className="relative z-[5] flex w-[800px] flex-col items-center gap-10 rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
      <GradientBorder
        gradientDirection="toTop"
        gradientStopColor="rgba(145, 206, 154, 0.50)"
        borderWidth={1}
      />

      <div className="relative flex h-[405px] w-[720px] flex-col items-center gap-2 rounded-3xl bg-neutral-900">
        <GradientBorder
          borderWidth={2}
          borderRadius={24}
          gradientDirection="toBottom"
          gradientStopColor="rgba(145, 206, 154)"
          gradientStartColor="rgba(255, 255, 255, 0.1)"
        />

        <video
          loop={false}
          muted={isMuted}
          ref={videoReference}
          onEnded={handleVideoEnd}
          onPlay={handleVideoPlay}
          onTimeUpdate={updateTime}
          className="pointer-events-none w-full rounded-3xl"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          <source src="/videos/brand-intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {showPlayOverlay && (
          <div
            onClick={() => {
              void videoReference.current?.play();
            }}
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-3xl bg-black/50"
          >
            <Icon size={64} name="Play" className="text-white" />
          </div>
        )}

        {!showPlayOverlay && remainingTime !== 0 && (
          <>
            <div className="pointer-events-none absolute bottom-2 left-3 flex min-h-[25px] min-w-[60px] items-center justify-center rounded-md bg-black/30 px-2 py-1">
              {remainingTime && (
                <span className="animate-fade-in text-center text-body5 text-white duration-75">
                  {formatTime(remainingTime)}
                </span>
              )}
            </div>

            <button
              onClick={toggleMute}
              className="absolute bottom-2 right-3 flex size-6 items-center justify-center rounded-md bg-black/30 p-1"
            >
              {isMuted ? (
                <Icon
                  size={16}
                  name="SoundDisabledFilled"
                  className="text-white"
                />
              ) : (
                <Icon
                  size={16}
                  name="SoundEnabledFilled"
                  className="text-white"
                />
              )}
            </button>
          </>
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
                size="large"
                intent="primary"
                className="w-56"
                disabled={!isSuccess}
                suffixIconName="IdrissArrowRight"
                onClick={() => {
                  setCurrentContent('check-eligibility');
                }}
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
