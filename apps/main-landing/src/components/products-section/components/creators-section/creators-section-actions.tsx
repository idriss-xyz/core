import { CREATORS_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
export const CreatorsSectionActions = () => {
  return (
    <Button
      intent="secondary"
      size="large"
      className="w-full md:w-fit"
      asLink
      href={CREATORS_LINK}
      isExternal
    >
      CREATE DONATION LINK
    </Button>
  );
};
