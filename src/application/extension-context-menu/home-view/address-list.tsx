import { Icon, Tooltip } from 'shared/ui';
interface AddressListProperties {
  lookupText: string | undefined;
  foundAddresses: Record<string, string>;
  isTwitterLookup: boolean;
}
export const AddressList = ({
  foundAddresses,
  isTwitterLookup,
  lookupText,
}: AddressListProperties) => {
  return Object.entries(foundAddresses).length > 0 ? (
    <div className="absolute max-h-40 w-full overflow-y-auto rounded-md border border-gray-300 text-black [scrollbar-color:gray_#efefef] [scrollbar-width:thin]">
      {Object.entries(foundAddresses)?.map(([key, value]) => {
        return (
          <Tooltip tooltipMessage="Copied address!" key={key + value}>
            <div className="flex cursor-pointer select-none justify-between border-b border-b-stone-300 px-2 hover:bg-gray-200">
              <div
                className="flex-col justify-between"
                onClick={() => {
                  void navigator.clipboard.writeText(value);
                }}
              >
                <div className="flex gap-1.5">
                  <span className="text-sm font-bold">{key}</span>
                  <span className="text-sm text-[#8adf85]">{lookupText}</span>
                </div>
                <p className="text-xs font-thin">{value}</p>
              </div>
              {isTwitterLookup && (
                <Icon
                  size={16}
                  name="TwitterLogoIcon"
                  className="mt-1 text-twitter-primary [&>path]:fill-rule-non-zero"
                />
              )}
            </div>
          </Tooltip>
        );
      })}
    </div>
  ) : (
    Object.entries(foundAddresses).length === 0 && (
      <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-md">
        <span className="text-gray-800">Nothing found.</span>
        <a
          href="https://www.idriss.xyz"
          target="_blank"
          className="ml-2 text-blue-600 hover:underline"
          rel="noreferrer"
        >
          Sign up for IDriss now!
        </a>
      </div>
    )
  );
};
