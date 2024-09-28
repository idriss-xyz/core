import { ContentScript } from 'infrastructure/content-script';

// TODO: remove after refactoring rest of extension
import { pageManagerFactory } from '../../common/pageManagers/factory';

pageManagerFactory(document, document.location)
  .then((x) => {
    return x?.init();
  })
  .catch(console.error);

if (window.top === window) {
  ContentScript.run(chrome);
}
