const { resolve, dirname, basename, join } = require('path');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { globSync } = require('glob');

const distDir = 'dist';

const baseDir = resolve(distDir.replace(/^\//, ''));
const htmlFiles = globSync(`${baseDir}/**/*.html`);

if (htmlFiles.length === 0) process.exit(0);

htmlFiles.forEach((file) => {
  const contents = readFileSync(file, 'utf8');
  let scriptCounter = 1;
  let scripts = [];

  const pageName = basename(file, '.html');
  const pageDir = join(dirname(file), pageName);
  mkdirSync(pageDir, { recursive: true });

  const newFileContents = contents.replace(/<script>([\s\S]+?)<\/script>/g, (_, scriptContent) => {
    const scriptFileName = `script${scriptCounter}.js`;
    const scriptFilePath = join(pageDir, scriptFileName);

    writeFileSync(scriptFilePath, scriptContent.trim(), 'utf8');
    scripts.push(`<script src="${pageName}/${scriptFileName}"></script>`);

    scriptCounter++;
    return '';
  });

  if (scripts.length > 0) {
    const updatedFileContents = newFileContents.replace('</body>', scripts.join('\n') + '\n</body>');
    writeFileSync(file, updatedFileContents, 'utf8');
  }
});
