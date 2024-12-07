import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Switch as DesignSystemSwitch } from '@idriss-xyz/ui/switch';
import { classes } from '@idriss-xyz/ui/utils';
import { ReactNode } from 'react';

import { ExtensionSettingName, useExtensionSettings } from 'shared/extension';

const SettingBase = (properties: { label: string; action: ReactNode }) => {
  return (
    <label className="group flex cursor-pointer items-center justify-between py-2">
      <Label>{properties.label}</Label>
      {properties.action}
    </label>
  );
};

const Label = (properties: { children: ReactNode; className?: string }) => {
  return (
    <span
      className={classes(
        'text-label4 text-neutral-700',
        'group-hover:text-mint-600',
      )}
    >
      {properties.children}
    </span>
  );
};

const Switch = (properties: { name: ExtensionSettingName }) => {
  const { extensionSettings, changeExtensionSetting } = useExtensionSettings();

  return (
    <DesignSystemSwitch
      onChange={(value) => {
        return changeExtensionSetting({ name: properties.name, value });
      }}
      value={extensionSettings[properties.name]}
    />
  );
};

const ArrowRightButton = (properties: { onClick: () => void }) => {
  return (
    <IconButton
      onClick={properties.onClick}
      iconName="ArrowRight"
      intent="tertiary"
      size="medium"
      className="p-0.5"
    />
  );
};

export const Setting = Object.assign(SettingBase, { Switch, ArrowRightButton });
