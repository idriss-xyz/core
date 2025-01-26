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
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

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
          gradientDirection="toBottom"
          gradientStopColor="rgba(145, 206, 154)"
          gradientStartColor="rgba(255, 255, 255, 0.1)"
          borderWidth={2}
          borderRadius={24}
        />
        <video
          ref={videoReference}
          muted={isMuted}
          onTimeUpdate={updateTime}
          onEnded={handleVideoEnd}
          onPlay={handleVideoPlay}
          className="pointer-events-none w-full rounded-3xl"
          loop={false}
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          <source src="/videos/brand-intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {showPlayOverlay && (
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-3xl bg-black/50"
            onClick={() => {
              void videoReference.current?.play();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-16 text-white"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
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
              className="absolute bottom-2 right-3 flex size-6 items-center justify-center rounded-md bg-black/30 p-1"
              onClick={toggleMute}
            >
              {isMuted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4 text-white"
                >
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4 text-white"
                >
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                  <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                </svg>
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
