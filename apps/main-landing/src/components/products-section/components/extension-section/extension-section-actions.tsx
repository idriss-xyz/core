import {
  CHROME_EXTENSION_LINK,
  EXTENSION_USER_GUIDE_LINK,
} from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
export const ExtensionSectionActions = () => {
  return (
    <>
      {/* 2xl, 3xl */}
      <Button
        intent="secondary"
        size="medium"
        className="flex w-full lg:w-fit 4xl:hidden"
        asLink
        href={CHROME_EXTENSION_LINK}
        isExternal
      >
        DOWNLOAD EXTENSION
      </Button>
      <Button
        intent="tertiary"
        size="medium"
        className="flex w-full text-neutral-100 lg:w-fit 4xl:hidden"
        asLink
        href={EXTENSION_USER_GUIDE_LINK}
        isExternal
      >
        LEARN MORE
      </Button>
      {/* 4xl */}
      <Button
        intent="secondary"
        size="large"
        className="hidden w-full lg:w-fit 4xl:flex"
        asLink
        href={CHROME_EXTENSION_LINK}
        isExternal
      >
        DOWNLOAD EXTENSION
      </Button>
      <Button
        intent="tertiary"
        size="large"
        className="hidden w-full text-neutral-100 lg:w-fit 4xl:flex"
        asLink
        href={EXTENSION_USER_GUIDE_LINK}
        isExternal
      >
        LEARN MORE
      </Button>
    </>
  );
};
