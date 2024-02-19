import { pageManagerFactory } from '../../common/pageManagers/factory';
import { ContentScript } from '../../infrastructure/contentScript';

pageManagerFactory(document, document.location).then((x) => x?.init());
ContentScript.run(chrome);
