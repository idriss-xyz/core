import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

import { Application } from './application.component';

export const bootstrapApplication = () => {
  const root = document.createElement('div');
  const shadowRoot = root.attachShadow({ mode: 'open' });
  const reactRoot = createRoot(shadowRoot);
  reactRoot.render(createElement(Application));
  document.body.append(root);
};
