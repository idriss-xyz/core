export type TradingCopilotDialogsProperties = {
  activeDialogId: string | null;
  closeDialog: () => void;
};

export type TradingCopilotFormValues = {
  amount: string;
};

export type TradingCopilotDialogProperties = {
  dialog: {
    uuid: string;
    details: {
      name: string;
      amount: number;
      crypto: string;
      when: string;
      title: string;
    };
    user: {
      balance: number;
      crypto: string;
    };
    id: string;
  };
  activeDialogId: string | null;
  closeDialog: () => void;
};
