import { useQuery } from '@tanstack/react-query';

import { GetImageAsBase64Command } from '../../commands';

import { UseBase64ImageArguments } from './use-base-64-image.types';

const getBase64Image = async (url: string) => {
  const command = new GetImageAsBase64Command({ url });
  return command.send<string>();
};

export const useBase64Image = ({ url }: UseBase64ImageArguments) => {
  return useQuery({
    queryKey: ['getBase64Image', url],
    enabled: url.length > 0,
    queryFn: () => {
      // sometimes polymarket stores images as base64 already
      if (url.startsWith('data:image')) {
        return url;
      }
      return getBase64Image(url);
    },
  });
};
