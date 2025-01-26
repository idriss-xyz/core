import { EligibilityCheckResponse } from '@/app/claim/types';

type Properties = { eligibilityData: EligibilityCheckResponse };

export const IdrissUserCriteriaDescription = ({
  eligibilityData,
}: Properties) => {
  return (
    <ul>
      <li>
        You have registered
        {eligibilityData.paid
          ? ` ${eligibilityData.paid} paid account${eligibilityData.paid > 1 ? 's' : ''}`
          : ''}
        {eligibilityData.paid && eligibilityData.free ? ' and' : ''}
        {eligibilityData.free
          ? ` ${eligibilityData.free} free account${eligibilityData.free > 1 ? 's' : ''}`
          : ''}
      </li>
      <li>You made transfers on {2} unique days with the browser extension</li>
    </ul>
  );
};
