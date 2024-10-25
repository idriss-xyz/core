import { Chip, classes } from 'shared/ui';

const getVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': {
      return 'positive';
    }
    case 'defeated': {
      return 'negative';
    }
    default: {
      return 'default';
    }
  }
};

export const StatusChip = ({ status }: { status: string }) => {
  const chipVariant = getVariant(status);
  return (
    <Chip
      className={classes(
        'rounded-sm border-[#EAECF0] px-[4px] py-0.5 font-bold uppercase tracking-wide',
        {
          'bg-#EBE5FF text-#725BFF': chipVariant === 'positive',
          'bg-[#FFE6E7] text-[#F44061]': chipVariant === 'negative',
          'bg-[#D9FFFB] text-[#00BFAF]': chipVariant === 'default',
        },
      )}
    >
      {status}
    </Chip>
  );
};
