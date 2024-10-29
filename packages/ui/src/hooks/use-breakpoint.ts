import { createBreakpoint } from 'react-use';

import { isBrowser } from '../utils';

// TODO: adjust breakpoints by passing breakpoints argument to createBreakpoint, it should be constant coming from tailwind-config package
const _useBreakpoint = createBreakpoint();
export const useBreakpoint = () => {
  const breakpoint = _useBreakpoint();
  if (!isBrowser()) {
    // return largest breakpoint to avoid Next hydration error, hydration error still happens on mobile devices,
    // TODO: we need to accept default breakpoint and apply it via useragent.device.type
    // https://github.com/vercel/next.js/discussions/13356#discussioncomment-9068748
    return 'laptopL';
  }
  return breakpoint;
};
