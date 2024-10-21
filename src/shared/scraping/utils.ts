import { v4 } from 'uuid';

export const getScrapedElementId = (element: Element) => {
  const htmlElement = element as HTMLElement;
  const idrissId = htmlElement.dataset.idrissid;

  if (idrissId && typeof idrissId === 'string') {
    return idrissId;
  }

  const newIdrissId = v4();
  htmlElement.dataset.idrissid = newIdrissId;
  return newIdrissId;
};
