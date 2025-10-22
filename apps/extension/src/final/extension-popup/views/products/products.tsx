import { Button } from '@idriss-xyz/ui/button';

export const Products = () => {

  return (
    <div className="bg-mint-100 px-4 py-6">
      <h1 className="text-center text-heading5 text-neutralGreen-900">
        {`We're moving on to bigger things`}
      </h1>
      <p className="mt-2 text-center text-label4 text-neutralGreen-700">
        Now building the best onchain<br />
        monetization app for streamers
      </p>
      <Button
        intent="primary"
        size="medium"
        isExternal
        asLink
        className="mx-auto mt-10"
        href='https://idriss.xyz'
        suffixIconName='IdrissArrowRight'
      >
        LEARN MORE
      </Button>
    </div>
  );
};
