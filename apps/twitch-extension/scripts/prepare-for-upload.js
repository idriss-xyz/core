const { resolve, dirname, basename, join } = require('path');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { globSync } = require('glob');

const baseDir = resolve('dist');
const htmlFiles = globSync(`${baseDir}/**/*.html`);
if (!htmlFiles.length) process.exit(0);

htmlFiles.forEach((file) => {
  let contents = readFileSync(file, 'utf8'), scripts = [], scriptCounter = 1;
  const pageName = basename(file, '.html');
  const pageDir = join(dirname(file), pageName);
  mkdirSync(pageDir, { recursive: true });

  contents = contents.replace(/<script>([\s\S]+?)<\/script>/g, (_, scriptContent) => {
    const scriptFileName = `script${scriptCounter++}.js`;
    writeFileSync(join(pageDir, scriptFileName), scriptContent.trim(), 'utf8');
    scripts.push(`<script src="${pageName}/${scriptFileName}"></script>`);
    return '';
  }).replace(/\/?_next\//g, './_next/');

  if (scripts.length) contents = contents.replace('</body>', scripts.join('\n') + '\n</body>');
  writeFileSync(file, contents, 'utf8');
});

globSync(`${baseDir}/**/*.{css,html,js}`).forEach((file) => {
  let content = readFileSync(file, 'utf8');
  if (file.endsWith('.css')) {
    content = content.replace(/url\(\s*['"]?\/?_next\/([^)"']+)['"]?\s*\)/g, 'url("../../../_next/$1")');
  } else {
    content = content.replace(/(["'\(])\/?_next\//g, '$1./_next/')
      .replace(/(src|href)=["']\/?_next\//g, '$1="./_next/')
      .replace(/(href|src)=["']\/\.\//g, '$1="./')
      .replace(/\/\.\//g, '/')
      .replace(/(["'\(])\/\/_next\//g, '$1./_next/');
  }
  writeFileSync(file, content, 'utf8');
});
