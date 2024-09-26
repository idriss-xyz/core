import { ReactNode } from 'react';

interface MainSettingsMenuListItem {
  label: ReactNode;
  prefix: ReactNode;
  suffix?: ReactNode;
  onClick?: () => void;
}

export const MainSettingsMenuListItem = ({
  label,
  prefix,
  suffix,
  onClick,
}: MainSettingsMenuListItem) => {
  return (
    <li
      className="flex shrink-0 grow cursor-pointer items-center space-x-2 whitespace-nowrap py-3 text-base hover:text-green-500"
      onClick={onClick}
    >
      {prefix}
      <span>{label} </span>
      {suffix}
    </li>
  );
};
