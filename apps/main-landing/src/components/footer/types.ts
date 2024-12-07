import { IconName } from '@idriss-xyz/ui/icon';

export type SectionItem = {
  name: string;
  link: string;
  isExternal: boolean;
  prefixIconName?: IconName;
};
