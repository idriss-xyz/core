import { classes } from '@idriss-xyz/ui/utils';

import { EligibilityCheckResponse } from '@/app/claim/types';

type Properties = { eligibilityData: EligibilityCheckResponse };

const formatNumber = (value: number | undefined) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

const formatDate = (date: string | undefined) => {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date ?? ''));
};

export const IdrissUserCriteriaDescription = ({
  eligibilityData,
}: Properties) => {
  const liBaseClassName =
    "relative flex justify-between pr-1 before:absolute before:-left-4 before:text-red-500 before:content-['•']";
  return (
    <ul className="list-none pl-5">
      <li
        className={classes(
          liBaseClassName,
          (eligibilityData.allocation_paid ||
            eligibilityData.allocation_free) &&
            'before:text-mint-600',
        )}
      >
        <span>
          You registered
          {eligibilityData.paid
            ? ` ${eligibilityData.paid} paid account${eligibilityData.paid > 1 ? 's' : ''}`
            : ''}
          {eligibilityData.paid && eligibilityData.free ? ' and' : ''}
          {eligibilityData.free
            ? ` ${eligibilityData.free} free account${eligibilityData.free > 1 ? 's' : ''}`
            : ''}
          {!eligibilityData.paid && !eligibilityData.free && 'an account'}
        </span>
        <span>
          {formatNumber(
            Number(eligibilityData.allocation_paid ?? 0) +
              Number(eligibilityData.allocation_free ?? 0),
          )}
        </span>
      </li>
      <li
        className={classes(
          liBaseClassName,
          eligibilityData.allocation_extension && 'before:text-mint-600',
        )}
      >
        <span>
          You made transfers on {eligibilityData.extension} unique days with the
          {'\u00A0'}browser extension
        </span>
        <span>{formatNumber(eligibilityData.allocation_extension)}</span>
      </li>
      <li
        className={classes(
          liBaseClassName,
          eligibilityData.time_multiplier > 1 && 'before:text-mint-600',
        )}
      >
        <span>
          Early user multiplier
          {eligibilityData.time_multiplier > 1 &&
            `: you registered the account\u00A0on ${formatDate(eligibilityData.registration)}`}
        </span>
        <span>
          x{'\u00A0'}
          {eligibilityData.time_multiplier}
        </span>
      </li>
      <li
        className={classes(
          liBaseClassName,
          eligibilityData.invite_multiplier > 1 && 'before:text-mint-600',
        )}
      >
        <span>
          Referral multiplier{' '}
          {eligibilityData.invite_multiplier > 1 &&
            `: you invited ${eligibilityData.invites} users`}
        </span>
        <span>
          x{'\u00A0'}
          {eligibilityData.invite_multiplier}
        </span>
      </li>
    </ul>
  );
};
