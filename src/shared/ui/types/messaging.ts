export type OnWindowMessageFunction = <T>(
  type: string,
  callback: (data: T, removeListener: () => void) => void,
) => void;
