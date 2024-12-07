# CSP
TODO: describe

## Intercepting http network globally with service worker
The CSP gets applied before requests are sent to service workers,
so it's not possible for a service worker to rewrite a request that would originally violate the CSP.
