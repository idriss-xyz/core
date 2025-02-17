import { ReactNode, useMemo } from "react";
import {
  WalletProvider,
} from "@solana/wallet-adapter-react";

export const SolanaContextProviders = ({ children }: { children: ReactNode }) => {
  const wallets = useMemo(() => [], []);

  return (
    <WalletProvider wallets={wallets}>
        { children }
    </WalletProvider>
  );
};
