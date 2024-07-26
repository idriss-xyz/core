import { classes } from '../../utils/classes';

import { TabHandleProperties } from './tab-handle.types';

export const TabHandle = ({
  left,
  imageSrc,
  name,
  isActive,
  theme,
  onClick,
}: TabHandleProperties) => {
  return (
    <button
      onClick={onClick}
      style={{ left }}
      className={classes(
        'absolute -top-[25px] flex h-[25px] w-[100px] cursor-pointer flex-row items-center gap-[6px] rounded-t-lg pl-2 pt-1 font-bold transition-all duration-75 ease-linear will-change-transform',
        {
          'bg-[#2d2d2d]': theme === 'dark',
          'bg-white': theme === 'bright',
          '-top-[23px] -translate-x-[3px] scale-95 brightness-75': !isActive,
        },
      )}
    >
      {imageSrc && <img className="h-4" src={imageSrc} />}
      <span
        className={classes({
          'text-white': theme === 'dark',
          'text-black': theme === 'bright',
        })}
      >
        {name}
      </span>
    </button>
  );
};
