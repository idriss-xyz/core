export {
  COMMAND_MAP as UTILS_COMMAND_MAP,
  GetImageAsBase64Command,
  GetImageCommand,
} from './commands';

export { getDifferenceInDays, getEndsInLabel } from './date-utils';
export { isFarcasterName } from './subscription-utils';
export { reverseObject, createLookup } from './objects';

export const isCorrectImageString = (image: string) => {
  return image.startsWith('data:image');
};
