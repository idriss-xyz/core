import styles from './tailwind.build.css';
import { ProviderProperties } from './types';

export const WithTailwind = ({ children }: ProviderProperties) => {
  return (
    <>
      <style type="text/css">{styles.toString()}</style>
      {children}
    </>
  );
};
