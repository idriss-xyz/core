import { COMMAND_REQUEST, COMMAND_RESPONSE } from '../../common/command-bus';
import { pageManagerFactory } from '../../common/pageManagers/factory';

pageManagerFactory(document, document.location).then((x) => x?.init());

const script = document.createElement('script');
script.src = browser.runtime.getURL('widgets.js');
document.body.appendChild(script);

window.addEventListener('message', (event) => {
  const message = event.data;
  if (message.type === COMMAND_REQUEST) {
    const command = message.detail;

    browser.runtime.sendMessage(
      { type: COMMAND_REQUEST, data: command },
      (response) => {
        const responseMessage = {
          type: COMMAND_RESPONSE,
          detail: { response, commandId: command.id },
        };

        window.postMessage(responseMessage);
      },
    );
  }
});
