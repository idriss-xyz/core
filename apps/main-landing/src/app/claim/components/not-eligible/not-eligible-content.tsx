import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Link } from '@idriss-xyz/ui/link';
import { classes } from '@idriss-xyz/ui/utils';
import { GeoConditionalButton } from '@idriss-xyz/ui/geo-conditional-button';

export const NotEligibleContent = () => {
  return (
    <div className="relative z-[5] m-auto flex w-[600px] flex-col items-center gap-10 rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
      <GradientBorder
        borderWidth={1}
        gradientDirection="toTop"
        gradientStopColor="rgba(145, 206, 154, 0.50)"
      />

      <div className="flex flex-col gap-4">
        <h1 className="text-heading3 text-neutral-900">NOT ELIGIBLE</h1>
        <p className="text-body4 text-neutral-700">
          While you do not qualify for the claim, you can still join IDRISS DAO
          by{'\u00A0'}purchasing IDRISS on decentralized exchanges.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <GeoConditionalButton
          defaultButton={[
            <Button
              asLink
              isExternal
              size="large"
              key="uniswap"
              intent="primary"
              className="w-full"
              prefixIconName="Uniswap"
              href="https://app.uniswap.org/swap?inputCurrency=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&outputCurrency=0x000096630066820566162C94874A776532705231"
            >
              BUY ON UNISWAP
            </Button>,
            <Button
              asLink
              isExternal
              key="jumper"
              size="large"
              intent="primary"
              className="w-full"
              prefixIconName="Jumper"
              href="https://jumper.exchange/?fromChain=8453&fromToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&toChain=8453&toToken=0x000096630066820566162C94874A776532705231"
            >
              BUY ON JUMPER
            </Button>,
          ]}
        />

        <div className="flex w-full items-center justify-center opacity-70">
          <p
            className={classes(
              'text-body5 text-neutralGreen-900',
              'md:text-body5',
            )}
          >
            By purchasing, you agree to the{' '}
            <Link
              isExternal
              size="medium"
              className={classes(
                'text-body5',
                'md:text-body5',
                //lg here is intentional to override the Link variant style
                'lg:text-body5',
              )}
              href={TOKEN_TERMS_AND_CONDITIONS_LINK}
            >
              Terms{'\u00A0'}and{'\u00A0'}conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
