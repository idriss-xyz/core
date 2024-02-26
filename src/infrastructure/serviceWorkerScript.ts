import { AddressResolver } from '../common/resolvers/AddressResolver';
import { SbtResolver } from '../common/resolvers/SbtResolver';

import { ServiceWorkerCommand, ServiceWorkerCommandBus } from './command-bus';
import { COMMAND_BUS_REQUEST_MESSAGE } from './constants';

export class ServiceWorkerScript {
  private constructor(private environment: typeof chrome) {}

  static run(environment: typeof chrome, onInstalled: () => void) {
    const serviceWorker = new ServiceWorkerScript(environment);

    serviceWorker.onServiceWorkerCommandRequests();
    serviceWorker.onInstalled(onInstalled);
    serviceWorker.onRestMessages();
  }

  onServiceWorkerCommandRequests() {
    this.onMessage<ServiceWorkerCommand>(
      COMMAND_BUS_REQUEST_MESSAGE,
      (data, sendResponse) => {
        ServiceWorkerCommandBus.execute(data).then((res: unknown) =>
          sendResponse(res),
        );
      },
    );
  }

  onMessage<Data>(
    type: string,
    callback: (data: Data, sendResponse: (response: unknown) => void) => void,
  ) {
    this.environment.runtime.onMessage.addListener(
      (request, _sender, sendResponse) => {
        if (request.type === type) {
          callback(request.data, sendResponse);
        }

        return true;
      },
    );
  }

  // TODO: refactor
  onRestMessages() {
    this.environment.runtime.onMessage.addListener(
      (request, _sender, sendResponse) => {
        if (request.type === 'apiAddressesRequest') {
          AddressResolver.get(request.value)
            .then((x) => sendResponse(x))
            .catch(() => sendResponse({}));
          return true;
        } else if (request.type === 'apiAddressesRequestBulk') {
          AddressResolver.getMany(request.value, '', request.network ?? '')
            .then((x) => sendResponse(x))
            .catch(() => sendResponse({}));
          return true;
        } else if (request.type === 'reverseResolveRequest') {
          AddressResolver.getManyReverse(request.value)
            .then((x) => sendResponse(x))
            .catch(() => sendResponse({}));
          return true;
        } else if (request.type === 'sbtRequest') {
          SbtResolver.getSBT(request.value)
            .then((x) => sendResponse(x))
            .catch(() => sendResponse({}));
          return true;
        } else if (request.type === 'getIconUrl') {
          if (request.custom == '') {
            fetch(this.environment.runtime.getURL('img/icon148.png'))
              .then((fetchRequest) => fetchRequest.blob())
              .then((blob) => this.readBlob(blob))
              .then((x) => sendResponse(x));
            return true;
          } else {
            fetch(this.environment.runtime.getURL(request.custom))
              .then((fetchRequest) => fetchRequest.blob())
              .then((blob) => this.readBlob(blob))
              .then((x) => sendResponse(x));
            return true;
          }
        } else if (request.type === 'getTwitterIconUrl') {
          fetch(this.environment.runtime.getURL('img/twitter.svg'))
            .then((fetchRequest) => fetchRequest.blob())
            .then((blob) => this.readBlob(blob))
            .then((x) => sendResponse(x));
          return true;
        }

        return true;
      },
    );
  }

  readBlob(b: Blob) {
    return new Promise(function (resolve) {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(b);
    });
  }

  onInstalled(onInstalled: () => void) {
    this.environment.runtime.onInstalled.addListener(onInstalled);
  }
}
