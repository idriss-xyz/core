import { MAIN_LANDING_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
export const CreatorsSectionActions = () => {
  return (
    <>
      {/* 2xl, 3xl */}
      <Button
        intent="primary"
        size="medium"
        className="flex w-full md:w-fit 4xl:hidden"
        asLink
        href={MAIN_LANDING_LINK}
        isExternal
      >
        START EARNING
      </Button>
      {/* 4xl */}
      <Button
        intent="primary"
        size="large"
        className="hidden w-full md:w-fit 4xl:flex"
        asLink
        href={MAIN_LANDING_LINK}
        isExternal
      >
        START EARNING
      </Button>
    </>
  );
};
