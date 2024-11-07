import { ReactNode, useEffect } from 'react';

import { useExtensionInfo } from './with-extension-info';

interface Properties {
  children: ReactNode;
}

const createGlobalStyles = (properties: { extensionId: string }) => {
  const { extensionId } = properties;
  return `
@font-face {
  font-family: 'aeonikPro';
  src: url('chrome-extension://${extensionId}/fonts/AeonikPro-Light.woff2') format('woff2');
  font-display: swap;
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'aeonikPro';
  src: url('chrome-extension://${extensionId}/fonts/AeonikPro-Regular.woff2') format('woff2');
  font-display: swap;
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'aeonikPro';
  src: url('chrome-extension://${extensionId}/fonts/AeonikPro-RegularItalic.woff2') format('woff2');
  font-display: swap;
  font-weight: 400;
  font-style: italic;
}

@font-face {
  font-family: 'aeonikPro';
  src: url('chrome-extension://${extensionId}/fonts/AeonikPro-Medium.woff2') format('woff2');
  font-display: swap;
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'aeonikPro Fallback';
  src: local("Arial");
  ascent-override: 91.72%;
  descent-override: 20.71%;
  line-gap-override: 0.00%;
  size-adjust: 101.40%;
}

:root, :host {
--font-aeonikpro: 'aeonikPro', 'aeonikPro Fallback'
}
`;
};

export const WithCustomFont = ({ children }: Properties) => {
  const extensionInfo = useExtensionInfo();

  useEffect(() => {
    const stylesElement = document.createElement('style');
    stylesElement.textContent = createGlobalStyles({
      extensionId: extensionInfo.id,
    });
    document.head.append(stylesElement);
    return () => {
      stylesElement.remove();
    };
  }, [extensionInfo.id]);

  return <>{children}</>;
};
