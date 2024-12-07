import { GITHUB_MAIN_HOST_NAME } from './constants';

export const getGithubUserLink = (username: string) => {
  return `https://${GITHUB_MAIN_HOST_NAME}/${username}`;
};
