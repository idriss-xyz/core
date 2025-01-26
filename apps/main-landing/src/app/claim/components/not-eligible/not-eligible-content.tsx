import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Link } from '@idriss-xyz/ui/link';
import { classes } from '@idriss-xyz/ui/utils';

export const NotEligibleContent = () => {
  return (
    <div className="relative z-[5] m-auto flex w-[600px] flex-col items-center gap-10 rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
      <GradientBorder
        gradientDirection="toTop"
        gradientStopColor="rgba(145, 206, 154, 0.50)"
        borderWidth={1}
      />
      <div className="mt-10 flex flex-col gap-4">
        <span className="text-heading3 text-neutral-900">NOT ELIGIBLE</span>
        <span className="text-body4 text-neutral-700">
          While you do not qualify for the claim, you can still join IDRISS DAO
          by purchasing IDRISS on decentralized exchanges.
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          key="uniswap"
          intent="primary"
          size="large"
          prefixIconName="Uniswap"
          asLink
          href="https://app.uniswap.org/swap?inputCurrency=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&outputCurrency=0x000096630066820566162C94874A776532705231"
          isExternal
          className="mx-auto w-full md:w-auto"
        >
          BUY ON UNISWAP
        </Button>
        <Button
          key="jumper"
          intent="primary"
          size="large"
          prefixIconName="Jumper"
          asLink
          href="https://jumper.exchange/?fromChain=8453&fromToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&toChain=8453&toToken=0x000096630066820566162C94874A776532705231"
          isExternal
          className="w-full whitespace-nowrap md:w-auto"
        >
          BUY ON JUMPER
        </Button>
        <div>
          <span
            className={classes(
              'text-body5 text-neutralGreen-900',
              'md:text-body5',
            )}
          >
            By purchasing, you agree to the{' '}
          </span>
          <Link
            size="medium"
            href={TOKEN_TERMS_AND_CONDITIONS_LINK}
            isExternal
            className={classes(
              'border-none text-body5',
              'md:text-body5',
              //lg here is intentional to override the Link variant style
              'lg:text-body5',
            )}
          >
            Terms{'\u00A0'}and{'\u00A0'}conditions
          </Link>
        </div>
      </div>
    </div>
  );
};
