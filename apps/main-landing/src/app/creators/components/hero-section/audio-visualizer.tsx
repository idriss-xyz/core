'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@idriss-xyz/ui/icon';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type Properties = {
  isMuted: boolean;
};

export const AudioVisualizer = ({ isMuted }: Properties) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex size-8 items-center justify-center"
      onMouseEnter={() => {
        return setIsHovered(true);
      }}
      onMouseLeave={() => {
        return setIsHovered(false);
      }}
    >
      {isHovered ? (
        <motion.div
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Icon
            size={24}
            className="text-mint-400"
            name={isMuted ? 'SoundDisabled' : 'SoundEnabled'}
          />
        </motion.div>
      ) : (
        <DotLottieReact src="/animations/audio.lottie" loop autoplay />
      )}
    </div>
  );
};
