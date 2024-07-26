import { useEffect, useMemo } from 'react';
import { useEffectOnce } from 'react-use';

import { useWidgetTabs } from '../../providers/widget-tabs';
import { WidgetBase } from '../widget-base';
import { classes } from '../../utils/classes';

import { TabHandle } from './tab-handle.component';
import { WidgetTabProperties } from './widget-tab.types';

export const WidgetTab = ({
  top,
  theme,
  userHandle,
  tabImage,
  tabName,
  children,
  className,
  closeButtonClassName,
  onClose,
}: WidgetTabProperties) => {
  const {
    tabs,
    preferredTab,
    addWidgetTab,
    setUserPreferredTab,
    removeAllUserWidgets,
  } = useWidgetTabs();

  const userTabs = useMemo(() => {
    return tabs[userHandle];
  }, [tabs, userHandle]);

  const userPreferredTab = preferredTab[userHandle] ?? userTabs?.at(0);

  const left = useMemo(() => {
    const index = userTabs?.indexOf(tabName) ?? -1;
    if (index !== -1) {
      return index * 100;
    }

    return 0;
  }, [tabName, userTabs]);

  useEffectOnce(() => {
    addWidgetTab(userHandle, tabName);
  });

  useEffect(() => {
    if (userTabs === null && onClose) {
      onClose();
    }
  }, [onClose, userTabs]);

  if (!userTabs || userTabs.length === 0) {
    return null;
  }

  return (
    <WidgetBase
      className={classes(
        'z-10 overflow-visible rounded-[0.375rem] text-xs leading-tight ',
        {
          'z-20': userPreferredTab === tabName,
          'rounded-tl-none': userTabs.length > 1,
          'bg-[#2d2d2d]': theme === 'dark',
          'bg-white': theme === 'bright',
        },
        className,
      )}
      top={top}
      onClose={() => {
        removeAllUserWidgets(userHandle);
      }}
      closeButtonClassName={closeButtonClassName}
    >
      {userTabs.length > 1 && (
        <TabHandle
          imageSrc={tabImage}
          isActive={userPreferredTab === tabName}
          left={left}
          name={tabName}
          onClick={() => {
            setUserPreferredTab(userHandle, tabName);
          }}
          theme={theme}
        />
      )}
      {children}
    </WidgetBase>
  );
};
