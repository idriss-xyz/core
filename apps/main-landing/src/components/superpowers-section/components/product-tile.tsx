import { Icon } from '@idriss-xyz/ui/icon';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { ReactNode } from 'react';

type Properties = {
  name: string;
  title: string;
  features: string[];
  actions: ReactNode;
};

export const ProductTile = ({ name, title, features, actions }: Properties) => {
  return (
    <div className="group relative flex flex-1 flex-col gap-4 self-stretch rounded-[24px] bg-white/80 px-4 py-6 backdrop-blur-[7px] lg:gap-6 lg:px-10 lg:py-11">
      <span className="text-label5 text-neutralGreen-700 lg:text-label4">
        {name}
      </span>
      <span className="text-balance text-heading5 text-neutral-900 lg:text-heading4">
        {title}
      </span>
      <ul className="flex flex-col gap-4 text-neutralGreen-700">
        {features.map((point) => {
          return (
            <li className="flex flex-row gap-3" key={point}>
              <div>
                <Icon
                  name="Check"
                  className="text-neutralGreen-700"
                  size={20}
                />
              </div>
              <div className="text-body5 lg:text-body4">{point}</div>
            </li>
          );
        })}
      </ul>
      <div className="flex w-full justify-center gap-2 rounded-[15px] text-center transition-opacity lg:absolute lg:bottom-[2px] lg:right-[1.667px] lg:gap-4 lg:bg-[linear-gradient(180deg,_rgba(255,255,255,0)_0%,_rgba(255,255,255,0.96)_24.58%)] lg:px-10 lg:pb-6 lg:pt-10 lg:opacity-0 lg:group-hover:opacity-100">
        {actions}
      </div>

      <GradientBorder gradientDirection="toTop" borderRadius={24} />
    </div>
  );
};
