// TODO: Remove this from setup folder and move to a shared components file like packages/ui
import { useRef, useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ProgressBarV2 } from '@idriss-xyz/ui/progress-bar-v2';
import { Icon } from '@idriss-xyz/ui/icon';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

const MAX_FILE_SIZE_KB = 300 * 1024;

function formatFileName(filename: string): string {
  const dotIndex = filename.lastIndexOf('.');
  const name = filename.slice(0, dotIndex);
  const extension = filename.slice(dotIndex);

  if (name.length <= 25) {
    return name + extension;
  }
  return name.slice(0, 20) + '..' + extension;
}

const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

const formatFileSize = (bytes: number) => {
  return `${Math.round(bytes / 1024)} KB`;
};

interface FileProperties {
  show?: boolean;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  hasCustomSound?: boolean;
  showUploadInterface?: boolean;
}

export const File = ({
  show,
  onUpload,
  onRemove,
  hasCustomSound = false,
  showUploadInterface = false,
}: FileProperties) => {
  const { getAccessToken } = usePrivy();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputReference = useRef<HTMLInputElement>(null);

  // Initialize file state based on hasCustomSound prop
  useEffect(() => {
    if (hasCustomSound && !file) {
      // Create a placeholder file object to represent the existing custom sound
      const placeholderFile = { name: 'custom-sound.mp3', size: 0 };
      setFile(placeholderFile as File);
      setProgress(100);
    }
  }, [hasCustomSound, file]);

  const handleSelectedFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    await handleFileUpload(files);
  };

  const handleDroppedFile = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(null);
    const files = event.dataTransfer.files;
    await handleFileUpload(files);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length > 1) {
      setError('Only one file allowed');
      return;
    }

    const file = files[0];

    if (!file) {
      setError('No file selected');
      return;
    }

    if (file.type !== 'audio/mpeg') {
      setError(`Invalid file type: ${file.type}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_KB) {
      setError('File is too large, max allowed is 300KB');
      return;
    }

    const authToken = await getAccessToken();
    if (!authToken) {
      setError('Authentication failed. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setProgress(0);

    // Simulate progress-bar-v2 visually
    const interval = setInterval(() => {
      setProgress((previous) => {
        if (previous >= 95) {
          clearInterval(interval); // Let fetch handle final state
          return previous;
        }
        return previous + 5;
      });
    }, 150);

    const response = await fetch(`${CREATOR_API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      clearInterval(interval);
      setIsUploading(false);
      const errorMessage = await response.text();
      setError(errorMessage);
      return;
    }

    clearInterval(interval);
    setProgress(100); // Set final progress-bar-v2
    setIsUploading(false);
    setFile(file);
    setError(null);
    onUpload?.(file);
  };

  const resetUpload = () => {
    setFile(null);
    setIsUploading(false);
    setProgress(0);
    setError(null);
    if (fileInputReference.current) fileInputReference.current.value = '';
    onRemove?.();
  };

  if (show === false) return null;

  const shouldShowUploadInterface =
    showUploadInterface || (!file && !isUploading);

  return (
    <div className="flex w-[360px] flex-col gap-6">
      {shouldShowUploadInterface ? (
        <div
          onClick={() => {
            return fileInputReference.current?.click();
          }}
          onDrop={handleDroppedFile}
          onDragOver={handleDragOver}
          className="flex cursor-pointer flex-col items-center gap-6 rounded-[12px] bg-neutral-200 p-8"
        >
          <div className="flex size-[56px] items-center justify-center gap-2.5 rounded-[12px] bg-white">
            <Icon name="UploadCloud" size={24} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-0.5 pb-1">
              <div className="h-4.5 w-[219px]">
                <span className="text-label4">
                  Drop your files here or {` `}
                  <span className="underline decoration-solid underline-offset-[3px]">
                    browse
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-label6 text-neutral-600">
                Max file size up to 500 KB
              </span>

              {error && (
                <span className="flex items-center space-x-1 pt-1 text-label7 text-red-500 lg:text-label7">
                  <Icon name="AlertCircle" size={12} className="p-0.5" />
                  {error}
                </span>
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputReference}
            className="hidden"
            onChange={handleSelectedFile}
            accept="audio/mpeg"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 rounded-[12px] border border-neutral-200 p-2">
          <div className="flex gap-4">
            <div className="flex size-[42px] items-center justify-center gap-2.5 rounded-[12px] border border-neutral-300 bg-white">
              <Icon name="UploadCloud" size={24} />
            </div>

            <div className="flex flex-col">
              {/*TODO: In design there is 112px -> to small to display 25 sign file name with desired font*/}
              <div className="h-4.5">
                <span className="text-label4 text-[#111928]">
                  {file && formatFileName(file?.name)}
                </span>
              </div>

              <div className="h-[20px] w-[46px]">
                <span className="text-body5 text-[#6B7280]">
                  {file && formatFileSize(file?.size)}
                </span>
              </div>

              {(file ?? isUploading) && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="h-[4px] w-[262px]">
                      <ProgressBarV2 progress={progress} />
                    </div>
                  </div>
                  <button onClick={resetUpload}>
                    <Icon name="X" size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
