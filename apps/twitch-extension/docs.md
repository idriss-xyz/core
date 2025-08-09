# Twitch extension

#### All instructions assume you are in the root directory of a monorepo - so make sure you are using the console in the correct directory before taking any steps.

&nbsp;

---

## 1. Localhost usage

#### As a first step, you need to install dependencies using

```bash
pnpm install
```

&nbsp;

#### Then, for development purposes, you can use the :dev command

```bash
pnpm twitch-extension:dev
```

This command will start a localhost server at the URL http://localhost:3000 (If other applications on your device are using port `:3000`, it will use the next available port, e.g., `:3001`).

&nbsp;

#### Or use the :prod command for production purposes

```bash
pnpm twitch-extension:prod
```

This command will create a `dist` directory inside your twitch-extension app directory. You then need to manually pack all files from this directory into a ZIP file to make them ready for upload to Twitch servers.

&nbsp;

---

## 2. Twitch configuration & deploy

#### Creating and configuring the Twitch extension

1. On the [Twitch Dev Console](https://dev.twitch.tv/console/extensions), click `Create Extension` button.
2. Enter the extension name and click `Continue` button.
3. Check all 4 checkboxes in the 'Type of extension' section.
4. Switch to the 'Asset Hosting' tab and configure:

   > Testing Base URI: `http://localhost:3000`

   > Panel Viewer Path: `panel.html`

   > Panel Height: `430`

   > Video - Fullscreen Viewer Path: `video-overlay.html`

   > Mobile Path: `panel.html`

   > Video - Component Viewer Path: `video-component.html`

   > Target Height: `55`

   > Aspect Ratio: `360:292`

   > Autoscale: `Yes`

   > Scale Pixels: `360`

   > Config Path: `config.html`

5. Switch to the 'Capabilities' tab and configure:

   > Select how you will configure your extension: `Extension Configuration Service`

   > Allowlist for Image Domains: `https://imagedelivery.net, https://i.imgur.com, https://ik.imagekit.io/lens/media-snapshot, https://euc.li`

   > Allowlist for Media Domains: `https://twitch.tv/, https://dev.twitch.tv/`

   > Allowlist for URL Fetching Domains: `wss://creators-api.idriss.xyz, https://creators-api.idriss.xyz, https://eth.llamarpc.com, https://euc.li, https://api.idriss.xyz`

&nbsp;

#### Usage

In this step, you need to decide whether you're using [local test](https://dev.twitch.tv/docs/extensions/life-cycle/#local-test) or [hosted test](https://dev.twitch.tv/docs/extensions/life-cycle/#twitch-cdn--hosted-test).

1. Start localhost using the :dev command **(Only for local test)**
2. Build files using the :prod command and pack them into a ZIP file **(Only for hosted test)**
3. Switch to the 'Files' tab **(Only for hosted test)**
4. Select the ZIP file with your assets **(Only for hosted test)**
5. Click the `Upload assets` button **(Only for hosted test)**
6. Switch to the 'Status' tab
7. Click `View on Twitch and Install`
8. Click `Install`
9. Click `Activate` and select the type of extension (Only the panel is visible without starting a stream)
10. Click `Configure` and update your wallet address in the extension
11. The extension should now be visible on your profile

&nbsp;

---

## 3. Unique Implementation Details

> **Custom Postbuild Script**: Located at `scripts/prepare-for-upload.js`, this script customizes the output of the build process for Twitch compatibility.

&nbsp;

---

## 4. Dependencies imported from other apps

```ts
import { QueryProvider } from "@idriss-xyz/main-landing/providers";

import { Leaderboard } from "@idriss-xyz/main-landing/app/creators/donate/components/leaderboard";

import { DonationData, LeaderboardStats } from "@idriss-xyz/main-landing/app/creators/donate/types";

import { useGetTipHistory } from "@idriss-xyz/main-landing/app/creators/donate/commands/get-donate-history";
```

