import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';

export const BlockedButton = () => {
  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            intent="secondary"
            size="large"
            prefixIconName="GlobeIcon"
            className="w-full text-balance uppercase lg:w-auto"
            aria-disabled
            disabled
          >
            Unavailable
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white">
          <span>
            Participation is unavailable to individuals or companies who are
            residents of, are located in, are incorporated in, or have a
            registered agent in a restricted territory. See our{' '}
            <a
              href={TOKEN_TERMS_AND_CONDITIONS_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms and Conditions
            </a>
            .
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
