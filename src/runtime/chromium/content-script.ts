import { ContentScript } from 'infrastructure/content-script';

import { pageManagerFactory } from '../../common/pageManagers/factory';

pageManagerFactory(document, document.location)
  .then((x) => {
    return x?.init();
  })
  .catch(console.error);

ContentScript.run(chrome);
