import { Icon } from '@idriss-xyz/ui/icon';
import { useEffect, useRef, useState } from 'react';

import { formatTime } from '@/app/claim/components/about-idriss/utils';

export const VideoPlayer = () => {
  const videoReference = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
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

  const handleVideoPause = () => {
    videoReference.current?.pause();
    setShowPlayOverlay(true);
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
    <>
      <video
        loop={false}
        muted={isMuted}
        ref={videoReference}
        onEnded={handleVideoEnd}
        onPlay={handleVideoPlay}
        onTimeUpdate={updateTime}
        className="size-full cursor-pointer object-cover"
        onClick={(event) => {
          handleVideoPause();
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
          className="absolute inset-0 flex cursor-pointer items-center justify-center"
        >
          <span className="absolute size-full bg-[linear-gradient(113.57deg,_#022B1E_34.81%,_#079165_123.57%)] opacity-75" />

          <span className="block overflow-hidden rounded-full border border-white/25 bg-white/50 p-9 backdrop-blur-[100px]">
            <Icon size={64} name="Play" className="text-white" />
          </span>
        </div>
      )}

      {!showPlayOverlay && remainingTime !== 0 && (
        <>
          <div className="pointer-events-none absolute bottom-4 left-4 flex min-h-[25px] min-w-[60px] items-center justify-center rounded-md bg-black/30 px-2 py-1">
            {remainingTime && (
              <span className="animate-fade-in text-center text-body5 text-white duration-75">
                {formatTime(remainingTime)}
              </span>
            )}
          </div>

          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 flex size-6 items-center justify-center rounded-md bg-black/30 p-1"
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
    </>
  );
};
