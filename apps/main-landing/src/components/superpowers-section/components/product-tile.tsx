import { Icon } from '@idriss-xyz/ui/icon';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

type ProductTitleProperties = {
  productName: string;
  tileTitle: string;
  tileListPoints: string[];
};

export const ProductTile = ({
  productName,
  tileTitle,
  tileListPoints,
}: ProductTitleProperties) => {
  return (
    <div className="flex flex-1 flex-col gap-4 self-stretch rounded-[24px] bg-white/80 px-4 py-6 backdrop-blur-[7px] lg:gap-6 lg:px-10 lg:py-11">
      <span className="text-label5 text-neutralGreen-700 lg:text-label4">
        {productName}
      </span>
      <span className="text-balance text-heading5 text-neutral-900 lg:text-heading4">
        {tileTitle}
      </span>
      <ul className="flex flex-col gap-4 text-neutralGreen-700">
        {tileListPoints.map((point) => {
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

      <GradientBorder borderRadius={24} />
    </div>
  );
};
