import { idrissLogoBase64 } from './idriss-logo.constants';
import { IdrissLogoProperties } from './idriss-logo.types';

export const IdrissLogo = ({ size = 32 }: IdrissLogoProperties) => {
  return <img src={idrissLogoBase64} width={size} height={size} />;
};
