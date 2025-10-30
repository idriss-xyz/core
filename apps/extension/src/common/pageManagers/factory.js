import { DefaultPageManager } from "./defaultPageManager";

export function pageManagerFactory(document, url) {
  return new DefaultPageManager(document)
}
