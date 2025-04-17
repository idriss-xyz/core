export const checkForOrganizationBadge = (
  element?: Element | null,
): boolean => {
  const expectedPath =
    'M6.233 11.423l3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z';

  const profileView = element?.parentElement?.nextElementSibling;

  if (
    profileView &&
    profileView instanceof HTMLElement &&
    profileView?.dataset.testid === 'UserName'
  ) {
    return !!profileView?.querySelector(
      `[data-testid="icon-verified"] path[d="${expectedPath}"]`,
    );
  }

  const tweetView =
    element?.parentElement?.parentElement?.parentElement?.parentElement
      ?.parentElement?.parentElement?.parentElement?.parentElement;
  const tweetViewName =
    element?.parentElement?.parentElement?.parentElement?.parentElement
      ?.nextElementSibling;

  if (
    tweetView &&
    tweetView instanceof HTMLElement &&
    tweetView?.dataset.testid === 'tweet'
  ) {
    return !!tweetViewName?.querySelector(
      `[data-testid="icon-verified"] path[d="${expectedPath}"]`,
    );
  }

  const reTweetView =
    element?.parentElement?.parentElement?.nextElementSibling
      ?.firstElementChild;

  if (
    reTweetView &&
    reTweetView instanceof HTMLElement &&
    reTweetView?.dataset.testid === 'User-Name'
  ) {
    return !!reTweetView?.querySelector(
      `[data-testid="icon-verified"] path[d="${expectedPath}"]`,
    );
  }

  const popupView =
    element?.parentElement?.parentElement?.parentElement?.parentElement;
  const popupViewName = element?.parentElement?.nextElementSibling;

  if (
    popupView &&
    popupView instanceof HTMLElement &&
    popupView?.dataset.testid === 'HoverCard'
  ) {
    return !!popupViewName?.querySelector(
      `[data-testid="icon-verified"] path[d="${expectedPath}"]`,
    );
  }

  return false;
};
