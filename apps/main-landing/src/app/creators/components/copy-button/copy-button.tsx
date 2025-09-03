import { Button } from '@idriss-xyz/ui/button';

import { useCopyToClipboard } from '@/app/creators/hooks/use-copy-to-clipboard';

import { useToast } from '../../context/toast-context';

interface CopyButtonProperties {
  text: string;
  disabled?: boolean;
  className?: string;
}

export function CopyButton({
  text,
  disabled,
  className,
}: CopyButtonProperties) {
  const { copied, copy } = useCopyToClipboard();
  const { toast } = useToast();

  const handleClick = () => {
    if (text) {
      void copy(text);
      toast({
        type: 'success',
        heading: 'Your link has been copied',
        autoClose: true,
      });
    }
  };

  return (
    <Button
      size="medium"
      intent="secondary"
      onClick={handleClick}
      suffixIconName={copied ? undefined : 'IdrissArrowRight'}
      prefixIconName={copied ? 'Check' : undefined}
      className={`min-w-[137px] justify-center uppercase ${className ?? ''}`}
      disabled={disabled}
    >
      {copied ? 'Copied' : 'Copy link'}
    </Button>
  );
}
