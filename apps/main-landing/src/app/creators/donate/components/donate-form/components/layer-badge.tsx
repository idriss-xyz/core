import { Icon } from "@idriss-xyz/ui/icon";

export const LayersBadge = ({ amount }: { amount: string }) => {
    return (
      <div className="my-auto inline-flex min-h-4 items-center gap-[6px] rounded-[4px] border border-neutral-300 bg-white p-1">
        <Icon name="Layers" className="size-4 text-neutral-500" />
        <span className="text-label6 text-neutralGreen-900">{amount}</span>
      </div>
    );
  };