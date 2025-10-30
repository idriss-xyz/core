'use client';

import { Icon, IconName } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { ReactNode } from 'react';

interface PillLabelOption {
  label: string;
  icon?: IconName;
  customClass?: string;
}

interface PillLabelProperties {
  option: PillLabelOption;
  isActive?: boolean;
  onClick?: (label: string) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  children?: ReactNode;
}

const sizeClasses = {
  small: 'h-[28px] px-2 py-0.5 text-label5',
  medium: 'h-[34px] px-3 py-1 text-label4',
  large: 'h-[40px] px-4 py-2 text-label3',
};

const iconSizes = {
  small: 14,
  medium: 16,
  large: 18,
};

export const PillLabel = ({
  option,
  isActive = false,
  onClick,
  size = 'medium',
  className,
  children,
}: PillLabelProperties) => {
  const handleClick = () => {
    onClick?.(option.label);
  };

  return (
    <span
      onClick={handleClick}
      className={classes(
        'flex cursor-pointer items-center justify-center gap-1 rounded-full border border-mint-400 font-medium text-neutralGreen-900',
        sizeClasses[size],
        isActive ? 'bg-mint-400' : 'bg-white/80',
        onClick && 'cursor-pointer',
        !onClick && 'cursor-default',
        className,
      )}
    >
      {option.icon ? (
        <Icon
          size={iconSizes[size]}
          name={option.icon}
          className={classes('text-[#757575]', option.customClass)}
        />
      ) : null}
      {children ?? option.label}
    </span>
  );
};
