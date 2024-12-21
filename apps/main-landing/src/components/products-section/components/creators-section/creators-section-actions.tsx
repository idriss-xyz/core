import { CREATORS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
export const CreatorsSectionActions = () => {
  return (
    <>
      {/* 2xl, 3xl */}
      <Button
        intent="secondary"
        size="medium"
        className="block w-full md:w-1/2 lg:w-fit 4xl:hidden"
        asLink
        href={CREATORS_LINK}
        isExternal
      >
        CREATE DONATION LINK
      </Button>
      {/* 4xl */}
      <Button
        intent="secondary"
        size="large"
        className="hidden w-full md:w-1/2 lg:w-fit 4xl:block"
        asLink
        href={CREATORS_LINK}
        isExternal
      >
        CREATE DONATION LINK
      </Button>
    </>
  );
};
