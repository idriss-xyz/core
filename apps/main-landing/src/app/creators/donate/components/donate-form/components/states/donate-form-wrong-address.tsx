import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';

const baseClassName =
  'z-1 w-[440px] max-w-full rounded-xl bg-white px-4 pb-9 pt-6 flex flex-col items-center relative';

export function DonateFormWrongAddress({ className }: { className?: string }) {
  return (
    <div className={classes(baseClassName, className)}>
      <h1
        className={classes(
          'flex items-center justify-center gap-2 text-center text-heading4 text-red-500',
        )}
      >
        <Icon name="AlertCircle" size={40} /> <span>Wrong address</span>
      </h1>
    </div>
  );
}
