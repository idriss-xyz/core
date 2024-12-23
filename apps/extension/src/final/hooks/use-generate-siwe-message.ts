/* This is a work in progress, it is pending feedback */
import { useCallback, useEffect, useState } from 'react';
import { GetSiweMessageCommand } from 'application/trading-copilot';
import { useCommandMutation } from 'shared/messaging';
import { SiweMessageRequest } from 'application/trading-copilot/types';

export const useGenerateSiweMessage = ({walletAddress, chainId}: SiweMessageRequest) => {
  const getSiweMessageMutation = useCommandMutation(GetSiweMessageCommand)
  const [siweMessage, setSiweMessage] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);

  const generateSiweMessage = useCallback( async (properties: {walletAddress: string, chainId: number}) => {
    const {walletAddress, chainId} = properties;

    return getSiweMessageMutation.mutateAsync({
      walletAddress,
      chainId
    });
  }, [getSiweMessageMutation]);

  useEffect(() => {
    const getMessage = async() => {
      const {message, nonce} = await generateSiweMessage({walletAddress, chainId});
      setSiweMessage(message);
      setNonce(nonce);
    }
    getMessage();
  }, [generateSiweMessage, walletAddress, chainId]);

  return { siweMessage, nonce };
};
