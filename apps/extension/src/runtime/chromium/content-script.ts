if (window.document.contentType === 'text/html') {
  void import('infrastructure/content-script').then(({ ContentScript }) => {
    if (ContentScript.canRun()) {
      ContentScript.run(chrome);

      // TODO: block explorers needs to be refactored asap
      void import('../../common/pageManagers/factory').then(
        ({ pageManagerFactory }) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          void pageManagerFactory(document, document.location)?.init();
        },
      );
    }
  });
}
