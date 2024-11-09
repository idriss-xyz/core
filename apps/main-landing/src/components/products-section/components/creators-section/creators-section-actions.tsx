import { CHROME_EXTENSION_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
export const CreatorsSectionActions = () => {
  return (
    <Button
      intent="secondary"
      size="large"
      className="w-full md:w-fit"
      asLink
      href={CHROME_EXTENSION_LINK}
      isExternal
    >
      CREATE DONATION LINK
    </Button>
  );
};
