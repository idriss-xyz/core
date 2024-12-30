export const onWindowMessage = <T = unknown>(
  type: string,
  callback: (data: T, removeListener: () => void) => void,
) => {
  const listener = (event: MessageEvent) => {
    const message = event.data;

    if (message.type === type) {
      callback(message.detail, () => {
        window.removeEventListener('message', listener);
      });
    }
  };
  window.addEventListener('message', listener);
};
