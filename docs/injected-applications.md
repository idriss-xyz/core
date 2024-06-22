# Injected applications

## Overview

Our extension is specific because it injects into other websites (hosts).

## CSP
Some hosts are having strict security policy (check [CSP docs](csp.md)) which blocks direct HTTP calls.
The solution to this involves utilizing a service worker to bypass CSP restrictions and facilitate HTTP communications.

## Architecture

The extension is modularly designed to ensure clarity and scalability. It consists of several key components:

- Injected application: Usually React widget which includes specific logic.
- Service Worker: A background script that handles HTTP requests to bypass CSP.
- Command Bus: An abstraction layer for message-based communication between the applications and the service worker, employing an event-bus approach.

## Command Pattern and Event Bus

The communication between the injected application and the service worker is managed through a command pattern combined with an event bus.
This approach involves sending commands from the injected script, which are then executed by the service worker.

### Client Code Example
Our abstraction simulates async behiavour so you can use it as a normal http call.
To invoke a command:

```ts
const fooCommandDetails = { ... };

const foo = await CommandBus.invoke<FooResponse>(
  new FooCommand({ details: fooCommandDetails }),
);
```

Also we have abstraction built on top of [Tanstack Query](https://tanstack.com/query/latest)
So better way to invoke a command is to use `useCommandQuery` or `useCommandMutation` - choose Query if you need to get data at component render and Mutation if you need to send request inside some facade like submitting form etc.
Example:
```ts
    const marketQuery = useCommandQuery({
      command: new GetMarketByConditionIdCommand({ conditionId })
    });

    const marketMutation = useCommandMutation(GetMarketByConditionIdCommand);
    const submit = async () => {
      // ...
      await marketMutation.mutateAsync();
      // ...
    }
```

### Command

Commands is an abstraction needed to work seemelesly with things that would be normally blocked by CSP like HTTP calls.
Commands are type safe.
Command is built from:
- payload - needed for handler method
- id - for routing purposes, you should not pass id by yourself, it is generated automatically for you and it's only overriden inside serviceWorker
- name - for serviceWorker to register command
- handler method - function which executes in serviceWorker scope

```ts
type Payload = {
  bar: string;
};

type Response = {
  value: string;
}

export class FooCommand extends Command<
  Payload,
  Response
> {
  public readonly name = 'FooCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle(){
    // ...
    return new OkResult({ value: 'hello world' });
  }
}
```

## Notes

- The Axios library is incompatible with service workers, requiring alternative methods for making HTTP requests like fetch api.
