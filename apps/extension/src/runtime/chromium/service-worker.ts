import { ServiceWorker } from 'infrastructure/service-worker';

const UNINSTALL_SURVEY_URL = 'https://example.com/uninstall-survey';

ServiceWorker.run(chrome);

chrome.runtime.setUninstallURL(UNINSTALL_SURVEY_URL);
