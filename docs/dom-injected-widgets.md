# DOM Injected Widgets

## Overview

This documentation outlines the development and implementation of a browser extension designed to inject widgets into webpages. The widget is capable of making HTTP requests.
However, due to Content Security Policy (CSP), direct HTTP calls from the injected widget are restricted.
The solution to this challenge involves utilizing a service worker to bypass CSP restrictions and facilitate HTTP communications.

## Architecture

The extension is modularly designed to ensure clarity and scalability. It consists of several key components:

- Injected Widget: The user interface component that interacts with DOM.
- Service Worker: A background script that handles HTTP requests on behalf of the injected widget.
- Command Bus: An abstraction layer for message-based communication between the widget and the service worker, employing an event-bus approach.

## Command Pattern and Event Bus

The communication between the injected widget and the service worker is managed through a command pattern combined with an event bus.
This approach involves sending commands from the widget, which are then executed by the service worker.

### Client Code Example

To invoke a command from the injected widget:

```ts
const fooCommandDetails = { ... };

const foo = await CommandBus.invoke<FooResponse>(
  new FooCommand({ details: fooCommandDetails }),
);
```

### Command Bus Event Sending

When the command bus sends an event:

```ts
static invoke<Response>(command: Command): Promise<Response> {
  return new Promise((resolve) => {
    window.postMessage({
      type: COMMAND_REQUEST,
      detail: command,
    });

    const listener = (event: MessageEvent) => {
      if (
        event.data.type === COMMAND_RESPONSE &&
        event.data.detail.commandId === command.id
      ) {
        window.removeEventListener('message', listener);
        resolve(event.data.detail.response as Response);
      }
    };

    window.addEventListener('message', listener);
  });
}
```

### Content Script Listener

The event is caught by a content script, which then calls the service worker:

```ts
window.addEventListener('message', (event) => {
  const message = event.data;
  if (message.type === COMMAND_REQUEST) {
    const command = message.detail;

    chrome.runtime.sendMessage(
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
```

### Service Worker Execution

The service worker responds by calling a specific handler:

```ts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === COMMAND_REQUEST) {
    const command: Command = request.data;

    CommandBus.execute(command).then((res: unknown) => sendResponse(res));

    return true;
  }
});
```

### Command and Handler Example

Commands and handlers are defined for specific actions. Commands contain metadata like commandName and id for routing purposes.

```ts
type Details = {
  bar: string;
};

export class FooCommand {
  static commandName = 'FooCommand';
  public name: string;
  public id: string;

  constructor(public details: Details) {
    this.name = FooCommand.name;
    this.id = `${this.name}-${details.bar}`;
  }
}
```

### Example Handler

```ts
export class FooHandler {
  static async handle(command: FooCommand): Promise<FooResponse | undefined> {
    // Perform actions in the ServiceWorker, e.g., make an HTTP call via fetch
    // return ...;
  }
}
```

## Schema Validation

To ensure the integrity of data exchanged with third-party APIs, schema validation is applied to HTTP responses.
This practice helps maintain data accuracy and reliability.

## Module Organization

The extension's codebase is organized into modules, such as `src/snapshot` for [Snapshot](https://snapshot.org/#/) integration.
Public APIs of modules are exposed through index files (barrel files), with an important exception: the service worker should directly import commands and handlers from their respective modules to avoid circular dependencies and runtime errors.

## Notes

- The Axios library is incompatible with service workers, requiring alternative methods for making HTTP requests like fetch api.
