import { Icon, type IconName } from '@idriss-xyz/ui/icon';

import { ICON } from '../icon/constants';

type Properties = {
  logo: string;
  iconName?: string;
  className?: string;
  alt?: string;
  size?: number;
};

export const AssetLogo = ({
  logo,
  iconName,
  className,
  alt = '',
  size = 24,
}: Properties) => {
  if (iconName && iconName in ICON) {
    return (
      <Icon name={iconName as IconName} className={className} size={size} />
    );
  }
  return <img src={logo} alt={alt} className={className} />;
};
