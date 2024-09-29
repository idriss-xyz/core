import { ReactNode } from 'react';

import styles from './tailwind.build.css';

interface Properties {
  children: ReactNode;
}

const GLOBAL_STYLES = `
html, :host {
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
`;

export const TailwindProvider = ({ children }: Properties) => {
  return (
    <>
      <style type="text/css">{styles.toString()}</style>
      <style type="text/css">{GLOBAL_STYLES.toString()}</style>
      {children}
    </>
  );
};
