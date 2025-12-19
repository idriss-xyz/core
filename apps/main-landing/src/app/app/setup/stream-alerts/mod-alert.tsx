import { Icon } from '@idriss-xyz/ui/icon';

export const ModAlert = () => {
  return (
    <span className="grid max-h-[500px] w-fit grid-cols-[40px,1fr] items-center gap-x-4 rounded-xl border border-indigo-500 bg-white p-4 shadow-sm">
      <span className="rounded-full bg-indigo-200 p-2.5 text-indigo-500">
        <Icon name="InfoCircle" size={20} />
      </span>

      <div className="grid grid-cols-[1fr]">
        <div className="flex flex-col gap-y-1">
          <p className="text-label3 text-neutral-900">
            Type /mod idriss_xyz in your Twitch chat to enable additonal chat
            alerts
          </p>
        </div>
      </div>
    </span>
  );
};
