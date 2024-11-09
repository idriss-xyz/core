import { classes } from '@idriss-xyz/ui/utils';
import { ReactNode } from 'react';

const Card = (properties: {
  heading: ReactNode;
  title: ReactNode;
  description: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={classes(
        'flex flex-col items-center rounded-2xl bg-white px-1 pb-5 pt-3 text-center shadow-md transition-transform duration-300 hover:scale-105 hover:bg-neutral-100',
        properties.className,
      )}
    >
      {properties.heading}
      {properties.title}
      {properties.description}
    </div>
  );
};

const Title = (properties: { children: ReactNode; className?: string }) => {
  return (
    <h2
      className={classes(
        'text-label3 text-neutralGreen-900',
        properties.className,
      )}
    >
      {properties.children}
    </h2>
  );
};

const Description = (properties: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={classes(
        'text-body6 text-neutralGreen-700',
        properties.className,
      )}
    >
      {properties.children}
    </p>
  );
};

export const ProductCard = Object.assign(Card, { Title, Description });
