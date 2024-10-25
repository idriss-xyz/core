import { EMAIL_REGEXP, PHONE_REGEXP, TWITTER_REGEXP } from './constants';
import { IdrissIdentifierType } from './types';

export const getIdrissIdentifierType = (
  identifier: string,
): IdrissIdentifierType => {
  if (PHONE_REGEXP.test(identifier)) {
    return 'PHONE';
  }

  if (TWITTER_REGEXP.test(identifier)) {
    return 'TWITTER';
  }

  if (EMAIL_REGEXP.test(identifier)) {
    return 'EMAIL';
  }

  return 'UNKNOWN';
};

export const normalizePhoneIdentifier = (identifier: string) => {
  return '+' + identifier.replace(/[^\dA-Za-z]/, '');
};

export const normalizeTwitterIdentifier = (identifier: string) => {
  return identifier.replace('@', '');
};
