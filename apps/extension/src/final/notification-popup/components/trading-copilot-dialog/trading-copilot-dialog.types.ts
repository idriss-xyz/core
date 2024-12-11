export type TradingCopilotDialogFormValues = {
  amount: string;
};

export type TradingCopilotDialogProperties = {
  dialog: {
    details: {
      name: string;
      amount: number;
      crypto: string;
      when: string;
    };
    user: {
      balance: number;
      crypto: string;
    };
    id: string;
  };
  closeDialog: () => void;
};
