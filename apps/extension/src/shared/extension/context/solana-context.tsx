import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { useExtensionInfo } from "shared/ui/providers/with-extension-info";

const getProxyRpcEndpoint = async (extensionId: string) => {

  return new Promise<string>((resolve) => {
    window.postMessage({
      type: "proxySolanaRequest",
      data: {
        apiKey: process.env.HELIUS_API_KEY,
        body: { jsonrpc: "2.0", id: 1, method: "getHealth", params: [] }
      }
    });

    window.addEventListener("message", (event) => {
      if (event.data.type === "SOLANA_RPC_RESPONSE") {
        if (event.data.detail?.success) {
          resolve(`chrome-extension://${extensionId}/rpc-proxy`);
        } else {
          console.error("Failed to set up proxy:", event.data.detail?.error);
          resolve("");
        }
      }
    });
  });
};

export const SolanaContextProviders = ({ children }: { children: ReactNode }) => {
  const extensionInfo = useExtensionInfo();

  const [proxyEndpoint, setProxyEndpoint] = useState<string>("");

  useEffect(() => {
    getProxyRpcEndpoint(extensionInfo.id).then(setProxyEndpoint);
  }, []);

  const wallets = useMemo(() => [], []);

  if (!proxyEndpoint) return null; // Wait until proxy is set up

  return (
    <ConnectionProvider endpoint={proxyEndpoint}>
      <WalletProvider wallets={wallets}>
          { children }
      </WalletProvider>
    </ConnectionProvider>
  );
};
