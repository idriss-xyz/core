import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import { useClaimPage } from '../../claim-page-context';

import geoist_avatar from './assets/geoist_avatar.png';
import levertz_avatar from './assets/levertz_avatar.png';

export const LetterContent = () => {
  const { setCurrentContent } = useClaimPage();
  return (
    <div className="relative z-[5] m-auto flex w-[600px] flex-col items-center gap-10 rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
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
        <div className="flex flex-col gap-6 text-body5 text-neutralGreen-700">
          <span>GM anon,</span>
          <span>Thank you for believing in IDRISS and joining us on this journey.</span>
          <span>
            Lorem ipsum dolor sit amet consectetur. At duis arcu ultricies risus
            aliquam. At consequat faucibus eget ultrices. Aliquet duis aliquam
            sagittis vel eget praesent. Enim orci elit nullam sit arcu ornare
            donec quis semper.
          </span>
          <span>Onwards!</span>
          <span>Founding contributors of IDRISS DAO</span>
        </div>
        <div className="absolute bottom-[-20px] right-[70px] inline-flex rotate-[-7.71deg] flex-col items-center gap-2 rounded-lg border border-neutral-300 bg-white p-2 shadow-lg">
          <img src={geoist_avatar.src} className="h-[70px] rounded-md" alt="" />
          <span className="text-label5 text-neutral-900">Geoist</span>
        </div>
        <div className="absolute bottom-[-8px] right-[-17px] inline-flex rotate-[9.718deg] flex-col items-center gap-2 rounded-lg border border-neutral-300 bg-white p-2 shadow-lg">
          <img
            src={levertz_avatar.src}
            className="h-[70px] rounded-md"
            alt=""
          />
          <span className="text-label5 text-neutral-900">Levertz</span>
        </div>
      </div>
      <Button
        intent="primary"
        size="large"
        suffixIconName="ArrowRight"
        className="w-56"
        onClick={() => {
          setCurrentContent('about-idriss');
        }}
      >
        Next
      </Button>
    </div>
  );
};
