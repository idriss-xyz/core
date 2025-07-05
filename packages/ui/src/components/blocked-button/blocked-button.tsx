import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';
import { ReactNode } from 'react';

import { Button } from '@idriss-xyz/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';
import { IconName } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';

type Properties = {
  buttonText?: string;
  iconName?: IconName;
  children?: ReactNode;
  buttonClasses?: string;
  tooltipClasses?: string;
  className?: string;
};

export const BlockedButton = ({
  buttonClasses,
  tooltipClasses,
  iconName = 'GlobeIcon',
  buttonText = 'Unavailable',
  children = <DefaultTooltipContent />,
  className,
}: Properties) => {
  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            intent="secondary"
            size="large"
            prefixIconName={iconName}
            className={classes(
              'w-full text-balance uppercase lg:w-auto',
              buttonClasses,
              className,
            )}
            aria-disabled
            disabled
          >
            {buttonText}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className={classes('bg-black text-white', tooltipClasses)}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const DefaultTooltipContent = () => {
  return (
    <span>
      Participation is unavailable to individuals or companies who are residents
      of, are located in, are incorporated in, or have a registered agent in a
      restricted territory. See our{' '}
      <a
        href={TOKEN_TERMS_AND_CONDITIONS_LINK}
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms and Conditions
      </a>
      .
    </span>
  );
};
