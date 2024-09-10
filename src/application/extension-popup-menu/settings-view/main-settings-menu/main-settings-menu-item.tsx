import { ReactNode } from 'react';

import { Icon, IconButton, IconName } from 'shared/ui';

interface MainSettingsMenuListItem {
  label: ReactNode;
  prefixIconName: IconName;
  suffixIconName?: IconName;
  onClick?: () => void;
}

export const MainSettingsMenuListItem = ({
  label,
  prefixIconName,
  suffixIconName,
  onClick,
}: MainSettingsMenuListItem) => {
  return (
    <li
      className="flex shrink-0 grow cursor-pointer items-center space-x-2 whitespace-nowrap py-3 text-base hover:text-green-500"
      onClick={
        onClick &&
        (() => {
          return onClick();
        })
      }
    >
      <Icon name={prefixIconName} size={20} />
      <span>{label} </span>
      {suffixIconName && (
        <IconButton
          className="absolute right-6"
          iconProps={{ name: suffixIconName, size: 25 }}
        />
      )}
    </li>
  );
};
