import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

export const MobileNotSupportedContent = () => {
  return (
    <div className="relative z-[5] m-auto flex w-[600px] flex-col items-center gap-10 rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px] lg:hidden">
      <GradientBorder
        gradientDirection="toTop"
        gradientStopColor="rgba(145, 206, 154, 0.50)"
        borderWidth={1}
      />
      <div className="relative flex w-full flex-col items-center gap-2 rounded-[25px] bg-[rgba(255,255,255,0.2)] px-10 py-8">
        <GradientBorder
          gradientDirection="toBottom"
          gradientStopColor="rgba(145, 206, 154)"
          gradientStartColor="#ffffff"
          borderWidth={2}
        />
        <span className="text-heading5 text-neutralGreen-700">
          This is a desktop or webapp experience, please use a PC
        </span>
      </div>
    </div>
  );
};
