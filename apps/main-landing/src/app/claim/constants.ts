export const IDRISS_TOKEN_ADDRESS =
  '0x7d1aA0eE2C550e2F4AC30c83BB27bf5DEfa7e8EE';

export const CLAIM_PAGE_ROUTE = {
  CHECK_ELIGIBILITY: '/check-eligibility',
  CLAIM: '/claim',
  VESTING_PLANS: '/vesting-plans',
  CLAIM_SUCCESSFUL: '/claim-successful',
} as const;

export type ClaimPageRoute =
  (typeof CLAIM_PAGE_ROUTE)[keyof typeof CLAIM_PAGE_ROUTE];
