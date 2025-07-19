import { useEffect, useState, useCallback } from 'react';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, []);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        return setCopied(false);
      }, 2000);
      return () => {
        return clearTimeout(timeout);
      };
    }
    return;
  }, [copied]);

  return { copied, copy };
}
