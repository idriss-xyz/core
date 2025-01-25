import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import idrissSceneStream from '../../assets/IDRISS_SCENE_STREAM_4_2 1.png';

export const MobileNotSupportedContent = () => {
  return (
    <main className="relative flex min-h-screen grow flex-col items-center justify-around overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-4 lg:hidden lg:flex-row lg:items-start lg:justify-center lg:px-0">
      <img
        src={idrissSceneStream.src}
        className="pointer-events-none absolute left-[-310px] top-[120px] z-1 h-[770px] w-[1233.px] min-w-[120vw] max-w-none rotate-[25.903deg]"
        alt=""
      />

      <div className="relative z-[5] m-auto flex flex-col items-center gap-10 rounded-[25px] bg-[rgba(255,255,255,0.5)] p-4 backdrop-blur-[45px]">
        <GradientBorder
          gradientDirection="toTop"
          gradientStopColor="rgba(145, 206, 154, 0.50)"
          borderWidth={1}
        />
        <div className="relative flex w-full flex-col items-center gap-2 rounded-[25px] bg-[rgba(255,255,255,0.8)] px-10 py-8">
          <GradientBorder
            gradientDirection="toBottom"
            gradientStopColor="rgba(145, 206, 154)"
            gradientStartColor="#ffffff"
            borderWidth={2}
          />
          <span className="text-balance text-center text-heading5 text-neutralGreen-700">
            This is a desktop or webapp experience, please use a PC
          </span>
        </div>
      </div>
    </main>
  );
};
