export type TradingCopilotToastProperties = {
  toast: {
    name: string;
    amount: number;
    crypto: string;
    when: string;
  };
  dialogId: string;
  openDialog: (dialogId: string) => void;
};
