import { ReactNode } from 'react';

import { NavigationSectionItem } from '../types';

type Properties = {
  title: ReactNode;
  items?: NavigationSectionItem[];
  onItemClick?: () => void;
};

export const Section = ({ title, onItemClick, items = [] }: Properties) => {
  return (
    <div>
      {title}
      <div className="space-y-6 px-5">
        {items.map((item, index) => {
          return (
            <a href="#" onClick={onItemClick} key={index} className="block">
              <span className="text-button2 block">{item.title}</span>
              <p className="text-body4 opacity-60">{item.description}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
};
