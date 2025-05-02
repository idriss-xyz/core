'use client';

import { useRef, useState } from 'react';

import { AudioVisualizer } from './audio-visualizer';

export const VideoPlayer = () => {
  const videoReference = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoReference.current) {
      videoReference.current.muted = !videoReference.current.muted;
      setIsMuted(videoReference.current.muted);
    }
  };

  return (
    <>
      <video
        loop
        autoPlay
        playsInline
        muted={isMuted}
        ref={videoReference}
        className="size-full cursor-pointer object-cover"
      >
        <source src="/videos/creators-intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <span className="absolute size-full bg-[linear-gradient(113.57deg,_#022B1E_34.81%,_#079165_123.57%)] opacity-50 duration-500 hover:opacity-25" />

      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 p-2"
      >
        <AudioVisualizer isMuted={isMuted} />
      </button>
    </>
  );
};
