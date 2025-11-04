import * as Progress from '@radix-ui/react-progress';
import { useEffect, useState } from 'react';

type Properties = {
  progress: number;
};

export const ProgressBarV2 = ({ progress }: Properties) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCompleteAnimation, setShowCompleteAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
      const wasComplete = isComplete;
      const nowComplete = progress >= 100;

      setIsComplete(nowComplete);

      // Trigger complete animation when transitioning to complete
      if (!wasComplete && nowComplete) {
        setShowCompleteAnimation(true);
        // Reset animation flag after animation completes
        setTimeout(() => {
          return setShowCompleteAnimation(false);
        }, 500);
      }
    }, 50);

    return () => {
      return clearTimeout(timer);
    };
  }, [progress, isComplete]);

  return (
    <Progress.Root
      value={animatedProgress}
      className={`relative size-full overflow-hidden rounded-full bg-gray-200 ${
        showCompleteAnimation ? 'animate-progress-complete' : ''
      }`}
    >
      <Progress.Indicator
        className="block h-full origin-left rounded-full bg-mint-400 transition-all duration-500 ease-out"
        style={{ width: `${Math.min(animatedProgress, 100)}%` }}
      />

      {/* Elliptical glow effect when complete */}
      {isComplete && (
        <div
          className="absolute left-1/2 top-1/2 h-3/4 w-1/2 -translate-x-1/2 -translate-y-1/2 animate-progress-glow rounded-full bg-lime-400 opacity-70"
          style={{ filter: 'blur(10px)' }}
        />
      )}
    </Progress.Root>
  );
};
