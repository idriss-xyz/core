import { IconButton } from '../icon-button';

import { Pagination } from './pagination.types';

export const PaginationComponent = ({
  pagination,
}: {
  pagination: Pagination;
}) => {
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
        className="px-1"
      />
      <IconButton
        disabled={!hasNext}
        onClick={onNext}
        iconProps={{ name: 'ArrowRightIcon' }}
        className="px-1"
      />
    </div>
  );
};
