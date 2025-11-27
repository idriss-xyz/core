/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');

// -------------------------------------
// Load ONLY FONTS_TOKEN locally
// -------------------------------------

if (!process.env.CI && !process.env.FONTS_TOKEN) {
  const environment = process.env.ENVIRONMENT || 'development';
  const file =
    environment === 'production' ? '.env.production' : '.env.development';
  const environmentPath = path.resolve(__dirname, file);

  if (fs.existsSync(environmentPath)) {
    const lines = fs.readFileSync(environmentPath, 'utf8').split('\n');

    for (const line of lines) {
      if (line.startsWith('FONTS_TOKEN=')) {
        const [, value] = line.split('=');
        if (value) process.env.FONTS_TOKEN = value.trim();
      }
    }
  }
}

// -------------------------------------
// Validate token
// -------------------------------------

const token = process.env.FONTS_TOKEN;
if (!token) {
  console.warn('[prepare-fonts] Missing FONTS_TOKEN');
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
}

// -------------------------------------
// Download helper
// -------------------------------------

function download(url, destination) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { Authorization: `token ${token}` } }, (result) => {
        if (result.statusCode !== 200) {
          return reject(new Error(`Failed: ${url} -> ${result.statusCode}`));
        }

        const out = fs.createWriteStream(destination);
        result.pipe(out);
        out.on('finish', resolve);
      })
      .on('error', reject);
  });
}

// -------------------------------------
// Main logic
// -------------------------------------

async function main() {
  const target = path.join(__dirname, 'src', 'app', 'fonts');
  fs.mkdirSync(target, { recursive: true });

  const base = 'https://raw.githubusercontent.com/idrisssystem/fonts/main';

  const files = [
    'AeonikPro-Light.woff2',
    'AeonikPro-Regular.woff2',
    'AeonikPro-RegularItalic.woff2',
    'AeonikPro-Medium.woff2',
    'AeonikPro-Medium.woff',
  ];

  for (const f of files) {
    await download(`${base}/${f}`, path.join(target, f));
  }
}

main().catch((error) => {
  console.error('[prepare-fonts] Error:', error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});
