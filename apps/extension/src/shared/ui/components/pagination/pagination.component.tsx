import { classes } from '../../utils';
import { IconButton } from '../icon-button';

import { PaginationComponentProperties } from './pagination.types';

export const PaginationComponent = ({
  pagination,
  buttonClassNames,
}: PaginationComponentProperties) => {
  const { hasPrevious, hasNext, onPrevious, onNext } = pagination;

  if (!hasPrevious && !hasNext) {
    return;
  }
  return (
    <div className="flex justify-end gap-[10px] text-gray-700">
      <IconButton
        disabled={!hasPrevious}
        onClick={onPrevious}
        iconProps={{ name: 'ArrowLeftIcon' }}
        className={classes('px-1', buttonClassNames)}
      />
      <IconButton
        disabled={!hasNext}
        onClick={onNext}
        iconProps={{ name: 'ArrowRightIcon' }}
        className={classes('px-1', buttonClassNames)}
      />
    </div>
  );
};
